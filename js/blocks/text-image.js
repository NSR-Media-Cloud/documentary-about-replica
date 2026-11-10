// Hero "text + image": the photo drifts inside its frame while the page scrolls (−10% → +6.5% of its height,
// measured on the source: -81px at scroll 0, +50px at scroll 1500 for a 810px-tall photo at 1440×900).
// The range is measured from layout positions (offsetTop) so the entrance transform on the wrapper can't skew it.
import { qs, qsa, prefersReducedMotion } from '../dom.js';

const layoutTop = (el) => { let y = 0; for (let e = el; e; e = e.offsetParent) y += e.offsetTop; return y; };

export function initTextImage() {
  if (prefersReducedMotion()) return;
  qsa('.text-image').forEach((hero) => {
    const pic = qs('.text-image__image', hero);
    const img = pic && qs('img', pic);
    if (!img) return;
    gsap.fromTo(img, { yPercent: -10 }, {
      yPercent: 6.5, ease: 'none',
      scrollTrigger: {
        trigger: pic,
        start: () => Math.max(0, layoutTop(pic) - window.innerHeight),     // = clamp(top bottom)
        end: () => layoutTop(pic) + pic.offsetHeight,                       // = bottom top
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}
