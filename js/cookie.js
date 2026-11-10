// Cookie notice — "This website uses cookies. Manage / Accept", with a manage panel.
// Choice is remembered in localStorage (the source uses a 365-day cookie).
import { qs, qsa } from './dom.js';

const KEY = 'rta_cookies';

export function initCookie() {
  const root = qs('#cookie');
  if (!root) return;
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
  if (stored) return;

  const bannerView = qs('.cookie__banner-view', root);
  const manageView = qs('.cookie__manage-view', root);
  const analytics = qs('#cookie-analytics', root);

  const save = (analyticsOn) => {
    try { localStorage.setItem(KEY, JSON.stringify({ analytics: !!analyticsOn, t: Date.now() })); } catch (e) {}
    gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: () => { root.hidden = true; } });
  };

  qsa('[data-cookie]', root).forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.cookie;
    if (a === 'manage') {
      bannerView.hidden = true;
      manageView.hidden = false;
      root.classList.add('is-manage');
    } else if (a === 'accept' || a === 'accept-all') save(true);
    else if (a === 'save') save(analytics.checked);
  }));

  root.hidden = false;
  gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 0.5 });
}
