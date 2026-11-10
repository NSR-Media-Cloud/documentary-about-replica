// Nav — scroll-linked hide/show bar + full-screen menu.
//  • The bar follows the scroll delta: it slides away while you read down and comes
//    straight back when you scroll up (or when you near the page end).
//  • "Menu" opens a full-viewport black panel (height + bg wipe, staggered link reveals).
//  • On desktop, hovering a course link slides that course's cover up in the right column.
import { qs, qsa, isPhone } from './dom.js';

export function initNav({ lenis }) {
  const nav = qs('#nav');
  const menu = qs('#menu');
  const btn = qs('.nav__menu-button');
  const label = qs('span', btn);
  const bg = qs('.menu__bg', menu);
  const inner = qs('.menu__inner', menu);
  let open = false;
  let busy = null;

  /* ---------- scroll-linked bar ---------- */
  const setY = gsap.quickSetter(nav, 'y', 'px');
  let offset = 0;
  let last = lenis.scroll;
  lenis.on('scroll', ({ scroll }) => {
    if (open) return;
    const h = nav.offsetHeight;
    const delta = scroll - last;
    const nearEnd = document.documentElement.scrollHeight - window.innerHeight - h;
    if (scroll > last) offset = scroll > nearEnd ? Math.max(0, offset - delta) : Math.min(h, offset + delta);
    else offset = Math.max(0, offset + delta);
    setY(-offset);
    last = scroll;
  });

  /* ---------- menu open / close ---------- */
  const sel = (s) => qsa(s, menu);
  function setOpenState(v) {
    open = v;
    btn.setAttribute('aria-expanded', String(v));
    label.textContent = v ? 'Close' : 'Menu';
    btn.classList.toggle('btn--orange', v);
    btn.classList.toggle('btn--border', !v);
    if (v) { menu.removeAttribute('inert'); menu.removeAttribute('aria-hidden'); }
    else { menu.setAttribute('inert', ''); menu.setAttribute('aria-hidden', 'true'); }
  }

  function openMenu() {
    if (open) return;
    busy && busy.kill();
    lenis.stop();
    setOpenState(true);
    offset = 0;
    gsap.to(nav, { y: 0, delay: 0.5, duration: 0.5 });
    const tl = gsap.timeline();
    busy = tl;
    tl.set(menu, { overflow: 'clip' })
      .fromTo(menu, { height: '0dvh' }, { height: '100dvh', ease: 'o4', duration: 1 })
      .fromTo(bg, { y: '-100%' }, { y: '0%', ease: 'o4', duration: 1 }, '<');
    if (!isPhone()) {
      tl.fromTo(sel('.menu__links-left .menu__page-link, .menu__links-left .menu__social-link, .menu__links-left .menu__heading-span'),
          { y: '100%' }, { y: 0, ease: 'o4', duration: 0.5, stagger: 0.05 }, '<10%')
        .fromTo(sel('.menu__links-right .menu__page-link, .menu__links-right .menu__heading-span'),
          { y: '100%' }, { y: 0, ease: 'o4', duration: 0.7, stagger: 0.05 }, '<')
        .fromTo(sel('.menu__links-right .menu__login'),
          { y: '100%', opacity: 0 }, { y: 0, opacity: 1, ease: 'o4', duration: 0.7, delay: 0.3 }, '<')
        .fromTo(qs('.menu__meta', menu), { y: '-100%' }, { y: 0, ease: 'o4', duration: 0.7 }, '<2%');
    }
    tl.set(menu, { overflow: 'auto' });
    const first = qs('.menu__page-link', menu);
    first && setTimeout(() => first.focus({ preventScroll: true }), 350);
  }

  function closeMenu() {
    if (!open) return;
    busy && busy.kill();
    lenis.start();
    setOpenState(false);
    busy = gsap.timeline()
      .set(menu, { overflow: 'clip' })
      .to(menu, { height: '0dvh', ease: 'o4', duration: 1 })
      .to(bg, { y: '-100%', ease: 'o4', duration: 1 }, '<');
    btn.focus({ preventScroll: true });
  }

  btn.addEventListener('click', () => (open ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) closeMenu(); });

  /* ---------- course cover hover (desktop) ---------- */
  const covers = qsa('.menu__image-container', menu);
  const courseItems = qsa('.menu__links-right ul > li', menu);
  const rightCol = qs('.menu__links-right', menu);
  courseItems.forEach((li, i) => {
    let timer;
    li.addEventListener('pointerenter', () => {
      timer = setTimeout(() => {
        if (!covers[i]) return;
        covers[i].style.zIndex = courseItems.length + 1;
        gsap.fromTo(covers[i], { y: '101%' }, { y: 0, ease: 'o4', duration: 1 });
      }, 50);
    });
    li.addEventListener('pointerleave', () => {
      clearTimeout(timer);
      covers.forEach((c) => { c.style.zIndex = c.style.zIndex > 1 ? c.style.zIndex - 1 : 1; });
    });
  });
  rightCol.addEventListener('pointerleave', () => covers.forEach((c) => gsap.to(c, { y: '101%', ease: 'o4', duration: 1 })));

  // pre-load the course covers once the page is idle so the first hover is instant
  setTimeout(() => qsa('.menu__image img', menu).forEach((img) => { img.loading = 'eager'; }), 2500);

  return { open: openMenu, close: closeMenu, isOpen: () => open };
}
