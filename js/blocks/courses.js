// Courses listing — view toggle, the stacked editorial cards (measured on the source) and the "new course" strips.
//   • each card's photo drifts from -20% to 0 while the card slides into place (scrub: clamp(top bottom) → top top)
//   • while the NEXT card slides over it, a card scales 1 → .9 and dims brightness 1 → .3 (scrub: next top bottom → top top)
//   • strips scroll left at 60px/s
import { qs, qsa, prefersReducedMotion } from '../dom.js';

export function initCourses({ lenis }) {
  const root = qs('[data-courses]');
  if (!root) return;
  const buttons = qsa('.courses-head__toggle button', root);
  const editorial = qs('.editorial', root);
  const grid = qs('.course-grid', root);
  const reduced = prefersReducedMotion();
  let ctx = null;
  let view = 'editorial';

  const buildEditorial = () => {
    ctx && ctx.revert();
    if (reduced) { ctx = null; return; }
    ctx = gsap.context(() => {
      const cards = qsa('.editorial__course', editorial);
      cards.forEach((card, i) => {
        const img = qs('.editorial__image img', card);
        gsap.fromTo(img, { yPercent: -20 }, {
          yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: card, start: 'clamp(top bottom)', end: 'top top', scrub: true, invalidateOnRefresh: true },
        });
        const next = cards[i + 1];
        if (next) {
          gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
            scale: 0.9, filter: 'brightness(0.3)', ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true },
          });
        }
      });
    }, editorial);
  };

  const setView = (v) => {
    if (v === view) return;
    view = v;
    buttons.forEach((b, i) => {
      const on = (i === 0) === (v === 'editorial');
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const show = v === 'editorial' ? editorial : grid;
    const hide = v === 'editorial' ? grid : editorial;
    if (v === 'grid') { ctx && ctx.revert(); ctx = null; }
    hide.hidden = true;
    show.hidden = false;
    if (v === 'editorial') buildEditorial();
    gsap.fromTo(show, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'none', clearProps: 'opacity' });
    lenis.resize();
    ScrollTrigger.refresh();
  };
  buttons.forEach((b, i) => b.addEventListener('click', () => setView(i === 0 ? 'editorial' : 'grid')));

  /* ---- strips ---- */
  const tracks = qsa('.marquee__track', root).map((track) => ({ track, x: 0 }));
  if (!reduced) {
    gsap.ticker.add((t, dt) => {
      tracks.forEach((m) => {
        if (!m.track.offsetParent) return;                                 // hidden view
        const slide = m.track.children[0];
        const w = slide.getBoundingClientRect().width + parseFloat(getComputedStyle(slide).marginRight);
        m.x -= 0.06 * dt;                                                  // 60px per second
        if (m.x <= -w) m.x += w;
        m.track.style.transform = `translate3d(${m.x}px,0,0)`;
      });
    });
  }

  buildEditorial();
}
