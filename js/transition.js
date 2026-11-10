// Page transition (rebuilt from the source's CSS, whose animation could not be captured): an 11-column wipe covers the page —
// each column scales up from the bottom, staggered — the next page loads underneath it, then the columns lift away from the top.
// Phones get a single dark panel that slides up instead. The corner frame closes in while covered and opens again on the reveal.
// A one-line script in <head> sets html.tr-cover on the next page so it never flashes before the reveal.
import { qs, qsa, isPhone, prefersReducedMotion } from './dom.js';

const KEY = 'rta-tr';
const html = document.documentElement;

export function initTransition() {
  const root = qs('#transition');
  const cols = qsa('.transition__col', root || document);
  const corners = root && qs('.transition__corners', root);
  const wipe = root && qs('.transition__wipe', root);
  const reduced = prefersReducedMotion();

  /** inset of the corner frame at its closed position */
  const cornerScale = () => {
    const r = corners.getBoundingClientRect();
    const rem = parseFloat(getComputedStyle(html).fontSize) || 1;
    return { x: (innerWidth - 48 * rem) / (r.width / (corners._s ? corners._s.x : 1)), y: (innerHeight - 48 * rem) / (r.height / (corners._s ? corners._s.y : 1)) };
  };

  const cover = (done) => {
    if (reduced || !root) { done(); return; }
    root.classList.add('is-running');
    if (isPhone()) { gsap.to(wipe, { y: '0%', duration: 0.7, ease: 'o3', onComplete: done }); return; }
    gsap.set(cols, { transformOrigin: '0 100%' });
    const s = cornerScale();
    corners._s = s;
    const tl = gsap.timeline({ onComplete: done });
    tl.to(cols, { scaleY: 1, duration: 0.65, ease: 'o3', stagger: { each: 0.045, from: 'start' } }, 0);
    tl.to(corners, { scaleX: s.x, scaleY: s.y, duration: 0.8, ease: 'o3' }, 0.1);
  };

  /** the next page is already covered (html.tr-cover): lift the columns */
  const reveal = (onStart) => {
    const finish = () => { html.classList.remove('tr-cover'); if (root) root.classList.remove('is-running'); gsap.set([...cols, wipe, corners].filter(Boolean), { clearProps: 'all' }); };
    if (reduced || !root) { finish(); onStart(); return; }
    // the cover class set the end state with CSS; hand the same state to GSAP so it can animate out of it
    if (isPhone()) {
      gsap.set(wipe, { y: '0%' }); html.classList.remove('tr-cover');
      gsap.to(wipe, { y: '-120%', duration: 0.8, ease: 'o3', delay: 0.05, onComplete: finish });
      setTimeout(onStart, 250);
      return;
    }
    root.classList.add('is-running');
    gsap.set(cols, { scaleY: 1, transformOrigin: '0 0' });
    const s = cornerScale();
    gsap.set(corners, { scaleX: s.x, scaleY: s.y }); corners._s = s;
    html.classList.remove('tr-cover');
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(cols, { scaleY: 0, duration: 0.75, ease: 'o3', stagger: { each: 0.045, from: 'start' }, delay: 0.1 }, 0);
    tl.to(corners, { scaleX: 1, scaleY: 1, duration: 0.8, ease: 'o3' }, 0.1);
    setTimeout(onStart, 380);   // text starts rising as the wipe lifts
  };

  // internal links: cover, remember that we did, then navigate
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol.indexOf('http') !== 0) return;
    if (url.pathname === location.pathname && url.search === location.search) return;   // same page / in-page anchor
    if (/\.(pdf|zip|png|jpe?g|svg|mp4)$/i.test(url.pathname)) return;
    e.preventDefault();
    try { sessionStorage.setItem(KEY, '1'); } catch (err) { /* private mode */ }
    cover(() => { location.href = url.href; });
  });
  // coming back with the back button (page restored from memory): drop any leftover cover
  window.addEventListener('pageshow', (e) => { if (e.persisted) { html.classList.remove('tr-cover'); if (root) { root.classList.remove('is-running'); gsap.set([...cols, wipe, corners].filter(Boolean), { clearProps: 'all' }); } } });

  return { reveal, covered: html.classList.contains('tr-cover') };
}
