// Accordion — one row open at a time; panel height animates (CSS .6s), the hover fill enters from the edge the pointer used.
import { qs, qsa } from '../dom.js';

export function initAccordions({ lenis } = {}) {
  const canHover = window.matchMedia('(hover: hover)').matches;

  qsa('.accordion').forEach((root) => {
    const tabs = qsa('.accordion__tab', root);
    let current = null;

    const fit = (tab) => {
      const panel = qs('.accordion__panel', tab);
      panel.style.height = tab.classList.contains('is-open') ? `${panel.scrollHeight}px` : '0px';
    };

    const setOpen = (tab, open) => {
      const btn = qs('.accordion__button', tab);
      const panel = qs('.accordion__panel', tab);
      tab.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      panel.toggleAttribute('inert', !open);
      fit(tab);
    };

    tabs.forEach((tab) => {
      const btn = qs('.accordion__button', tab);
      const panel = qs('.accordion__panel', tab);

      btn.addEventListener('click', () => {
        const willOpen = !tab.classList.contains('is-open');
        if (willOpen && current && current !== tab) setOpen(current, false);
        setOpen(tab, willOpen);
        current = willOpen ? tab : null;
      });

      panel.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'height') return;
        lenis && lenis.resize();
        window.ScrollTrigger && ScrollTrigger.refresh();
      });

      if (canHover) {
        const half = (e) => { const r = btn.getBoundingClientRect(); return e.clientY < r.top + r.height / 2 ? 'top' : 'bottom'; };
        const clear = () => btn.classList.remove('is-enter-top', 'is-enter-bottom', 'is-exit-top', 'is-exit-bottom');
        btn.addEventListener('mouseenter', (e) => { clear(); btn.classList.add(`is-enter-${half(e)}`); });
        btn.addEventListener('mouseleave', (e) => { clear(); btn.classList.add(`is-exit-${half(e)}`); });
      }
    });

    window.addEventListener('resize', () => tabs.filter((t) => t.classList.contains('is-open')).forEach(fit));

    /* course breakdown: the lesson list is collapsed until "Show Course Breakdown" is pressed */
    const wrap = qs('.accordion__list-wrap', root);
    const toggle = qs('.accordion__toggle', root);
    if (wrap && toggle) {
      const label = qs('[data-label]', toggle);
      const refresh = () => { lenis && lenis.resize(); window.ScrollTrigger && ScrollTrigger.refresh(); };
      const setWrap = (open) => {
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Hide Course Breakdown' : 'Show Course Breakdown';
        wrap.setAttribute('aria-hidden', String(!open));
        wrap.toggleAttribute('inert', !open);
        wrap.style.height = wrap.scrollHeight + 'px';
        if (!open) requestAnimationFrame(() => requestAnimationFrame(() => { wrap.style.height = '0px'; }));
      };
      toggle.addEventListener('click', () => setWrap(!toggle.classList.contains('is-open')));
      wrap.addEventListener('transitionend', (e) => {
        if (e.target !== wrap || e.propertyName !== 'height') return;
        if (toggle.classList.contains('is-open')) wrap.style.height = 'auto';
        refresh();
      });
      // a lesson row opening or closing changes the list height: keep the wrapper in step
      root.addEventListener('transitionend', (e) => { if (e.propertyName === 'height' && e.target.classList.contains('accordion__panel')) refresh(); });
    }
    const vp = qs('.accordion__slider-viewport', root);
    const prog = qs('.accordion__progress', root);
    if (vp && prog) {
      const upd = () => { const max = vp.scrollWidth - vp.clientWidth; prog.style.setProperty('--scale', max > 0 ? (vp.scrollLeft / max).toFixed(3) : '0'); };
      vp.addEventListener('scroll', upd, { passive: true });
      upd();
    }
  });
}
