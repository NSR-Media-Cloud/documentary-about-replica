// Scroll text — a dim (#333) paragraph with a white copy laid exactly on top.
// Each visual line of the white copy is revealed left → right, one line after
// another, as the section scrolls through the viewport (scrubbed, no easing).
import { qs, qsa, clamp, prefersReducedMotion } from './dom.js';
import { splitLines } from './split-text.js';

export function initScrollText() {
  const section = qs('.scroll-text');
  if (!section) return;
  const base = qs('.scroll-text__paragraph > div:not(.scroll-text__abs)', section);
  const abs = qs('.scroll-text__abs', section);

  let trigger = null;
  const build = () => {
    trigger && trigger.kill();
    const wraps = qsa(':scope > .wrap', abs);
    const n = wraps.length;
    // Accessibility addition (invisible by default): with reduced motion, show the paragraph fully revealed.
    if (prefersReducedMotion()) { wraps.forEach((w) => w.style.setProperty('--scale', '100%')); return; }
    wraps.forEach((w) => w.style.setProperty('--scale', '0%'));
    trigger = ScrollTrigger.create({
      trigger: section,
      start: 'clamp(0% 80%)',
      end: 'clamp(70% 50%)',
      scrub: true,
      onUpdate: (self) => {
        wraps.forEach((w, k) => {
          const a = (self.progress - k / n) * n;                // line k owns the k/n … (k+1)/n slice of progress
          w.style.setProperty('--scale', clamp(a * 100, 0, 100).toFixed(2) + '%');
        });
      },
    });
  };

  splitLines(base, { wrap: true });
  splitLines(abs, { wrap: true, onSplit: build });
}
