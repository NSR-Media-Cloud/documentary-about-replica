// Preloader — a black cover with "[ Name ] [ NN Percent ]".
// Progress is real (document, fonts, window load, hero images) but eased so the
// counter never jumps, and it takes at least ~1.1s.  On 100% the cover lifts
// (1s, "o3"), the text slides out and the nav drops in.
import { qs, qsa } from './dom.js';

export function runPreloader({ nav, onFinish }) {
  const wrap = qs('#pre-wrapper');
  if (!wrap) { onFinish(); return; }
  const pctEl = qs('#pre-percentage');
  const bg = qs('.preloader__bg', wrap);
  const textDivs = qsa('.preloader__text-wrap div', wrap);
  const heroImgs = qsa('.hero__images img');

  gsap.set(nav, { y: '-100%' });

  const MIN = 1100;
  const t0 = performance.now();
  const flags = { dom: document.readyState !== 'loading', fonts: false, load: document.readyState === 'complete', imgs: false };
  document.fonts.ready.then(() => { flags.fonts = true; });
  if (!flags.load) window.addEventListener('load', () => { flags.load = true; }, { once: true });
  const decode = (img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve());
  Promise.all(heroImgs.slice(0, 3).map(decode)).then(() => { flags.imgs = true; });

  let done = false;
  let shown = -1;
  const render = (p) => {
    const n = Math.floor(p);
    if (n === shown) return;
    shown = n;
    const t = n >= 100 ? '100' : String(n).padStart(2, '0');
    pctEl.textContent = `[ ${t} Percent ]`;
  };

  function finish() {
    if (done) return;
    done = true;
    render(100);
    document.documentElement.classList.add('is-ready');       // arms every .moveUp / .moveUpF
    onFinish();
    gsap.timeline()
      .to(bg, { y: '-100%', duration: 1, ease: 'o3' })
      .to(textDivs, { y: '-110%', duration: 0.3, ease: 'o3' }, '<5%')
      .to(nav, { y: '0%', duration: 1, ease: 'o3', clearProps: 'transform' })
      .add(() => { wrap.remove(); });
  }

  function tick() {
    if (done) return;
    const real = Object.values(flags).filter(Boolean).length / Object.keys(flags).length;
    const timeP = Math.min(1, (performance.now() - t0) / MIN);
    const eased = 1 - Math.pow(1 - timeP, 3);
    const cap = real >= 1 ? 1 : Math.min(0.97, 0.15 + real * 0.85);
    const p = Math.min(eased, cap) * 100;
    render(p);
    if (p >= 99.9) finish();
  }

  const loop = () => { tick(); if (!done) requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  const fallback = setInterval(() => { tick(); if (done) clearInterval(fallback); }, 120);   // keeps counting in background tabs
}
