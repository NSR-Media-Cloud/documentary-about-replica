// Enterprise page: the three panels in the stacked cards are live stand-ins for the source's short looping screen recordings
// (this study ships no footage). Each loops while its card is on screen and sleeps otherwise.
import { qs, qsa, prefersReducedMotion } from '../dom.js';

const whenVisible = (el, on, off) => {
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? on() : off()), { threshold: 0.25 });
  io.observe(el);
};

/** "5 users → 7 users": empty seats fill with people and the saving grows.  4.1 s loop. */
function seats(root) {
  const num = qs('[data-num]', root), save = qs('[data-save]', root), fill = qs('[data-fill]', root), slots = qsa('.demo__slot', root);
  const PER = 402, state = { n: 5 };
  const paint = () => { num.textContent = Math.round(state.n); save.textContent = '$' + Math.round(state.n * PER); fill.style.transform = `scaleX(${state.n / 7})`; };
  const reset = () => { slots.forEach((s, i) => s.classList.toggle('is-filled', i < 5)); state.n = 5; paint(); };
  const tl = gsap.timeline({ repeat: -1, paused: true, onRepeat: reset });
  [5, 6].forEach((i, k) => {
    tl.call(() => slots[i].classList.add('is-filled'), null, 0.6 + k);
    tl.to(state, { n: i + 1, duration: 0.55, ease: 'power2.out', onUpdate: paint }, 0.6 + k);
  });
  tl.to({}, { duration: 0.5 }, 3.6);
  reset();
  return tl;
}

/** Three course bars climb to a value, then to a second one.  5.7 s loop. */
function progress(root) {
  const rows = qsa('.demo__row', root);
  const sets = [[70, 51, 72], [78, 64, 85]];
  const paint = (row, v) => { row.style.setProperty('--p', v); qs('.demo__pct', row).textContent = Math.round(v) + '%'; };
  const state = rows.map(() => ({ v: 0 }));
  const reset = () => rows.forEach((r, i) => { state[i].v = 0; paint(r, 0); });
  const tl = gsap.timeline({ repeat: -1, paused: true, onRepeat: reset });
  [0.2, 3.0].forEach((t, s) => rows.forEach((r, i) => tl.to(state[i], { v: sets[s][i], duration: 1.3, ease: 'power3.out', onUpdate: () => paint(r, state[i].v) }, t + i * 0.18)));
  tl.to({}, { duration: 0.5 }, 5.2);
  reset();
  return tl;
}

/** Rotating benefit names inside three dashed rings.  18 s loop (six names, three seconds each). */
function benefits(root) {
  const words = root.dataset.words.split('|'), word = qs('[data-word]', root);
  const tl = gsap.timeline({ repeat: -1, paused: true });
  words.forEach((w, i) => {
    tl.call(() => { word.textContent = w; }, null, i * 3);
    tl.fromTo(word, { opacity: 0, y: 10, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }, i * 3);
    tl.to(word, { opacity: 0, y: -10, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in' }, i * 3 + 2.5);
  });
  return tl;
}

export function initTextMediaStack() {
  if (prefersReducedMotion()) return;   // the first frame of each panel is already in the markup
  qsa('[data-demo]').forEach((root) => {
    const tl = { seats, progress, benefits }[root.dataset.demo](root);
    whenVisible(root, () => tl.play(), () => tl.pause());
  });
}
