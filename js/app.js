// App entry — wires smooth scroll, GSAP and every module.
import { registerEases } from './eases.js';
import { qs, qsa, watchImages, prefersReducedMotion } from './dom.js';
import { runPreloader } from './preloader.js';
import { initNav } from './nav.js';
import { initHero } from './hero.js';
import { initScrollText } from './scroll-text.js';
import { initFounders } from './founders.js';
import { splitLines } from './split-text.js';
import { initCookie } from './cookie.js';
import { initPopup } from './popup.js';
import { initTransition } from './transition.js';

gsap.registerPlugin(ScrollTrigger, CustomEase);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
registerEases(CustomEase);

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ---- smooth scroll (same feel as the source: 1.2s, expo-out, 1.8× wheel) ---- */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 1.8,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  autoRaf: false,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
window.lenis = lenis;

watchImages();
const reduced = prefersReducedMotion();

/* ---- boot: wait for fonts (line splitting needs real glyph widths) ---- */
document.fonts.ready.then(() => {
  const nav = qs('#nav');
  const hero = qs('.hero__images') ? initHero({ reduced }) : { playIntro() {} };
  if (qs('.scroll-text')) initScrollText();
  if (qs('.founders')) initFounders();
  const navApi = initNav({ lenis });
  initCookie();
  initPopup({ lenis });

  // entrance text: every [data-split] outside the About hero (which splits its own) becomes masked lines
  qsa('[data-split]').forEach((el) => {
    if (el.closest('.hero')) return;
    const f = el.matches('.t-mono, .t-mono-s');
    splitLines(el, { lineClass: f ? 'moveUpF' : 'moveUp', delayStart: f ? 0.3 : 0.25 });
  });

  // page blocks load only where they appear
  if (qs('.accordion')) import('./blocks/accordion.js').then((m) => m.initAccordions({ lenis }));
  if (qs('.legal')) import('./blocks/legal.js').then((m) => m.initLegal({ lenis }));
  if (qs('.text-image')) import('./blocks/text-image.js').then((m) => m.initTextImage());
  if (qs('form.form')) import('./blocks/form.js').then((m) => m.initForms());
  if (qs('[data-courses]')) import('./blocks/courses.js').then((m) => m.initCourses({ lenis }));
  if (qs('.course-hero, .short-hero')) import('./blocks/course-hero.js').then((m) => m.initCourseHero({ lenis }));
  if (qs('.video-slider')) import('./blocks/video-slider.js').then((m) => m.initVideoSliders());
  if (qs('.tmc')) import('./blocks/text-media-cards.js').then((m) => m.initTextMediaCards());
  if (qs('[data-cta-click]')) import('./blocks/cta-click.js').then((m) => m.initCtaClick());
  if (qs('.pricing__strip-track')) import('./blocks/marquee.js').then((m) => m.initMarquees());
  if (qs('.tms')) import('./blocks/enterprise.js').then((m) => m.initTextMediaStack());
  if (qs('[data-watch]') || qs('[data-image-blocks]')) import('./blocks/competition.js').then((m) => m.initCompetition());
  if (qs('[data-glide], [data-quote-frame], [data-icon-text], [data-quiz], .testimonials')) import('./blocks/home.js').then((m) => m.initHome());
  if (qs('[data-film-grid]')) import('./blocks/film-grid.js').then((m) => m.initFilmGrids());

  // a link to the page you are already on just closes the menu and returns to the top (no reload)
  qsa('a[href]').forEach((a) => {
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (navApi.isOpen()) navApi.close();
      lenis.scrollTo(0);
    });
  });

  // first visit in a session: the preloader. Later pages: no preloader — the page wipe covers the switch and lifts to reveal the page.
  const html = document.documentElement;
  const transition = initTransition();
  let seen = false;
  try { seen = !!sessionStorage.getItem('rta-seen'); sessionStorage.setItem('rta-seen', '1'); } catch (e) { /* private mode */ }
  const start = () => { html.classList.add('is-ready'); hero.playIntro(); };
  if (seen || transition.covered) {
    const pre = qs('#pre-wrapper'); if (pre) pre.remove();
    if (transition.covered) transition.reveal(start); else start();
  } else {
    runPreloader({ nav, onFinish: () => hero.playIntro() });
  }

  // everything that depends on layout is measured now — make ScrollTrigger agree
  ScrollTrigger.refresh();
  window.addEventListener('load', () => { lenis.resize(); ScrollTrigger.refresh(); });
});
