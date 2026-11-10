// Tiny DOM helpers + shared state.
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
export const isPhone = () => window.matchMedia('(max-width: 480px)').matches;
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Fade `.img` wrappers in once their <img> has decoded (mirrors the source's "loaded" class). */
export function watchImages(root = document) {
  qsa('.img', root).forEach((pic) => {
    const img = pic.querySelector('img');
    if (!img) return;
    const mark = () => pic.classList.add('is-loaded');
    if (img.complete && img.naturalWidth) mark();
    else {
      img.addEventListener('load', mark, { once: true });
      img.addEventListener('error', mark, { once: true });
    }
  });
}

export function debounce(fn, ms = 150) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
