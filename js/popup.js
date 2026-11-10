// Subscribe popup.
//  • Auto: ~1s after load, and once the visitor has scrolled half a viewport, the popup
//    fades in (1s, "io2") and smooth-scroll is paused.  Closing remembers the choice for
//    the session (sessionStorage "popup" = "disabled"), subscribing remembers it for a year.
//  • Manual: every [data-open-subscribe] button opens the same card.
//  • The form is client-side only (validates, then shows the thank-you state) — nothing is sent.
//  Add ?popup=0 to the URL to disable the automatic popup while reviewing.
import { qs, qsa } from './dom.js';

export function initPopup({ lenis }) {
  const popup = qs('#popup');
  if (!popup) return;
  const form = qs('form', popup);
  const fields = qsa('.field', popup);
  const names = { fn: 'First name', ln: 'Last name', em: 'Email address' };
  let isOpen = false;
  let lastFocus = null;

  const subscribed = () => { try { return localStorage.getItem('rta_popup') === 'enabled'; } catch (e) { return false; } };
  const dismissed = () => { try { return sessionStorage.getItem('popup') === 'disabled'; } catch (e) { return false; } };

  gsap.set(popup, { autoAlpha: 0 });
  popup.removeAttribute('hidden');

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    lenis.stop();
    popup.removeAttribute('aria-hidden');
    gsap.to(popup, { autoAlpha: 1, duration: 1, ease: 'io2' });
    setTimeout(() => qs('.popup__wrap', popup).focus({ preventScroll: true }), 400);   // focus the dialog, not the first field
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    try { sessionStorage.setItem('popup', 'disabled'); } catch (e) {}
    popup.setAttribute('aria-hidden', 'true');
    gsap.to(popup, { autoAlpha: 0, duration: 0.5, ease: 'io2', onComplete: () => lenis.start() });
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }

  /* automatic, scroll-triggered */
  const params = new URLSearchParams(location.search);
  if (params.get('popup') !== '0' && !subscribed() && !dismissed()) {
    setTimeout(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: `${1.5 * window.innerHeight}px bottom`,
        once: true,
        onEnter: open,
      });
    }, 1000);
  }

  /* manual */
  qsa('[data-open-subscribe]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  qsa('[data-popup-close]', popup).forEach((b) => b.addEventListener('click', close));
  popup.addEventListener('click', (e) => { if (e.target.classList.contains('popup__container') || e.target.classList.contains('popup__overlay')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) close(); });

  /* form (demo only) */
  fields.forEach((f) => {
    const input = qs('input', f);
    const sync = () => f.classList.toggle('is-filled', !!input.value);
    input.addEventListener('input', sync);
    input.addEventListener('blur', sync);
  });
  const err = qs('.popup__error', popup);
  const ok = qs('.popup__success', popup);
  const wrap = qs('.popup__form-wrap', popup);
  const submit = qs('.popup__submit', popup);
  const names2 = qs('.popup__names', popup);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    ['fn', 'ln', 'em'].forEach((id) => {
      const input = qs('#' + id, popup);
      const good = id === 'em' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) : input.value.trim().length > 0;
      input.closest('.field').classList.toggle('is-invalid', !good);
      if (!good) valid = false;
    });
    err.hidden = valid;
    if (!valid) return;
    try { localStorage.setItem('rta_popup', 'enabled'); } catch (e) {}
    [names2, ...fields.filter((f) => !names2.contains(f)), submit].forEach((el) => { el.hidden = true; });
    ok.hidden = false;
  });
  qs('[data-popup-reset]', popup).addEventListener('click', () => {
    form.reset();
    fields.forEach((f) => f.classList.remove('is-filled', 'is-invalid'));
    [names2, ...fields.filter((f) => !names2.contains(f)), submit].forEach((el) => { el.hidden = false; });
    ok.hidden = true;
    err.hidden = true;
  });

  return { open, close };
}
