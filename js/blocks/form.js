// Forms — country picker, topics dropdown, validation and a local-only "sent" state (nothing is ever transmitted).
import { qs, qsa } from '../dom.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initForms() {
  qsa('form.form').forEach(setup);
}

function setup(form) {
  /* ---------------- phone: flag + dial-code picker ---------------- */
  const phone = qs('.phone', form);
  if (phone) {
    const sel = qs('.phone__selector', phone);
    const list = qs('.phone__list', phone);
    const flag = qs('.phone__flag', sel);
    const code = qs('.phone__code span', phone);
    const items = qsa('.phone__country', list);
    const setOpen = (open) => { phone.classList.toggle('is-open', open); sel.setAttribute('aria-expanded', String(open)); };
    const pick = (li) => {
      flag.src = `/assets/flags/${li.dataset.iso}.svg`;
      code.textContent = li.dataset.dial;
      items.forEach((i) => i.classList.toggle('is-current', i === li));
      setOpen(false);
      qs('input', phone).focus();
    };
    items.find((i) => i.dataset.iso === 'us')?.classList.add('is-current');
    sel.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!phone.classList.contains('is-open')); });
    sel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!phone.classList.contains('is-open')); }
      if (e.key === 'Escape') setOpen(false);
    });
    items.forEach((li) => { li.tabIndex = -1; li.addEventListener('click', () => pick(li)); });
    document.addEventListener('click', (e) => { if (!phone.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------------- topics: multi select ---------------- */
  const multi = qs('.multiselect', form);
  if (multi) {
    const input = qs('.multiselect__input', multi);
    const label = qs('.form__label', multi);
    const chips = qs('.multiselect__selected', multi);
    const items = qsa('.multiselect__item', multi);
    const real = qs('select', multi);
    const chosen = new Set();
    const setOpen = (open) => {
      multi.classList.toggle('is-open', open);
      input.setAttribute('aria-expanded', String(open));
      label.classList.toggle('is-floated', open || chosen.size > 0);
    };
    const render = () => {
      chips.hidden = chosen.size === 0;
      chips.innerHTML = '';
      chosen.forEach((v) => {
        const chip = document.createElement('span');
        chip.className = 'multiselect__chip';
        chip.innerHTML = `<span></span><button class="multiselect__remove" type="button" aria-label="Remove"> ×</button>`;
        chip.firstChild.textContent = v;
        chip.lastChild.textContent = '×';
        chip.lastChild.addEventListener('click', (e) => { e.stopPropagation(); chosen.delete(v); render(); });
        chips.appendChild(chip);
      });
      items.forEach((i) => { i.hidden = chosen.has(i.dataset.value); });
      [...real.options].forEach((o) => { o.selected = chosen.has(o.value); });
      input.classList.toggle('has-value', chosen.size > 0);
      label.classList.toggle('is-floated', multi.classList.contains('is-open') || chosen.size > 0);
      multi.closest('.form__field').classList.remove('is-invalid');
    };
    input.addEventListener('focus', () => setOpen(true));
    input.addEventListener('click', () => setOpen(true));
    qs('.multiselect__arrow', multi).addEventListener('click', (e) => { e.stopPropagation(); setOpen(!multi.classList.contains('is-open')); if (multi.classList.contains('is-open')) input.focus(); });
    items.forEach((li) => {
      const choose = () => { chosen.add(li.dataset.value); render(); };
      li.addEventListener('click', choose);
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
    });
    document.addEventListener('click', (e) => { if (!multi.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------------- validation + local submit ---------------- */
  const required = qsa('input[required], textarea[required]', form);
  const mark = (inputEl, msg) => {
    const f = inputEl.closest('.form__field');
    f.classList.toggle('is-invalid', !!msg);
    let note = qs('.form__validate', f);
    if (msg) {
      if (!note) { note = document.createElement('div'); note.className = 'form__validate t-sp'; note.setAttribute('role', 'alert'); f.appendChild(note); }
      note.textContent = msg;
    } else if (note) note.remove();
  };
  const check = (el) => {
    const v = el.value.trim();
    if (!v) return 'This field is required';
    if (el.type === 'email' && !EMAIL.test(v)) return 'Enter a valid email address';
    return '';
  };
  required.forEach((el) => {
    el.addEventListener('input', () => { if (el.closest('.form__field').classList.contains('is-invalid')) mark(el, check(el)); });
    el.addEventListener('blur', () => { if (el.value.trim() && el.type === 'email') mark(el, check(el)); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (qs('#website', form).value) return;                                   // honeypot
    const bad = required.filter((el) => { const m = check(el); mark(el, m); return m; });
    form.classList.toggle('is-failed', bad.length > 0);
    if (bad.length) { bad[0].focus(); return; }
    form.classList.add('is-sent');                                             // the replica never sends anything
    if (window.lenis) window.lenis.resize();
  });

  qs('[data-form-reset]', form)?.addEventListener('click', () => {
    form.reset();
    form.classList.remove('is-sent', 'is-failed');
    qsa('.is-invalid', form).forEach((f) => f.classList.remove('is-invalid'));
    qsa('.multiselect__remove', form).forEach((b) => b.click());
    if (window.lenis) window.lenis.resize();
  });
}
