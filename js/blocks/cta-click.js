// Click anywhere on the call-to-action and a photo appears under the pointer; the oldest one fades away after five.
import { qsa, qs, prefersReducedMotion } from '../dom.js';

export function initCtaClick() {
  qsa('[data-cta-click]').forEach((sec) => {
    let photos = [];
    try { photos = JSON.parse(sec.dataset.photos || '[]'); } catch (e) { photos = []; }
    if (!photos.length) return;
    const live = [];
    let n = 0;
    sec.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      const r = sec.getBoundingClientRect();
      const box = document.createElement('div');
      box.className = 'cta-click__drop';
      box.style.left = `${e.clientX - r.left}px`;
      box.style.top = `${e.clientY - r.top}px`;
      box.innerHTML = `<img alt="" src="${photos[n++ % photos.length]}">`;
      sec.appendChild(box);
      live.push(box);
      if (prefersReducedMotion()) gsap.set(box, { opacity: 1 });
      else gsap.fromTo(box, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'o3' });
      if (live.length > 5) {
        const old = live.shift();
        gsap.to(old, { opacity: 0, scale: 0.85, duration: 0.4, ease: 'none', onComplete: () => old.remove() });
      }
    });
  });
}
