// "Why join" cards — desktop: the title rises on hover to reveal the text (the rise equals the text's height);
// phone: the row scrolls sideways and a progress line follows it.
import { qs, qsa, isPhone } from '../dom.js';

export function initTextMediaCards() {
  qsa('.tmc').forEach((root) => {
    const slides = qsa('.tmc__slide', root);
    slides.forEach((s) => {
      const info = qs('.tmc__info', s);
      const body = qs('.tmc__body', s);
      if (!body) return;   // info cards have a title only
      const rise = () => (isPhone() ? '0px' : `${-(body.offsetHeight + 16 * (parseFloat(getComputedStyle(document.documentElement).fontSize)))}px`);
      const on = () => { if (isPhone()) return; s.classList.add('is-hover'); info.style.setProperty('--rise', `${-body.offsetHeight}px`); };
      const off = () => { s.classList.remove('is-hover'); info.style.setProperty('--rise', '0px'); };
      s.addEventListener('mouseenter', on);
      s.addEventListener('mouseleave', off);
      void rise;
    });
    const vp = qs('.tmc__viewport', root);
    const prog = qs('.tmc__progress', root);
    if (vp && prog) {
      const upd = () => { const max = vp.scrollWidth - vp.clientWidth; prog.style.setProperty('--scale', max > 0 ? (vp.scrollLeft / max).toFixed(3) : '0'); };
      vp.addEventListener('scroll', upd, { passive: true });
      upd();
    }
  });
}
