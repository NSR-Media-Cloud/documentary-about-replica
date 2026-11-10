// Course hero: the backdrop is fixed; a black overlay dims it linearly to 80% over the first screen of scrolling
// (measured on the source: --opacity = 0.8 × scrollY / viewport height, capped at 0.8).
import { qs } from '../dom.js';

export function initCourseHero({ lenis }) {
  const hero = qs('.course-hero, .short-hero');
  if (!hero) return;
  const update = (y) => hero.style.setProperty('--opacity', Math.min(0.8, (0.8 * y) / hero.offsetHeight).toFixed(4));
  lenis.on('scroll', ({ scroll }) => update(scroll));
  update(window.scrollY);
}
