// Auto-scrolling strips (pricing cards): the track moves left at 60px/s and loops by one slide width.
import { qsa, prefersReducedMotion } from '../dom.js';

export function initMarquees(selector = '.pricing__strip-track') {
  if (prefersReducedMotion()) return;
  const tracks = qsa(selector).map((track) => ({ track, x: 0 }));
  if (!tracks.length) return;
  gsap.ticker.add((t, dt) => {
    tracks.forEach((m) => {
      if (!m.track.offsetParent) return;
      const slide = m.track.children[0];
      const w = slide.getBoundingClientRect().width + parseFloat(getComputedStyle(slide).marginRight);
      m.x -= 0.06 * dt;
      if (m.x <= -w) m.x += w;
      m.track.style.transform = `translate3d(${m.x}px,0,0)`;
    });
  });
}
