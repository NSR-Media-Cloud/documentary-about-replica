// Hero — six images "fly" toward the viewer through a 100vw perspective.
//   1. Intro: the first three images arrive from -200vw (z → 0) one after another.
//   2. Scrub: once the intro has finished, scroll pushes every image through the
//      camera plane (z → viewport width); the three late images also fade in on the way.
import { qs, isPhone } from './dom.js';
import { splitLines } from './split-text.js';

export function initHero({ reduced }) {
  const header = qs('.hero');
  const box = qs('.hero__images');
  const imgs = [...box.children];
  const tag = qs('.hero__tag');
  const heading = qs('.hero__heading');

  // Entrance text: tag rises as a single line, heading line by line (delays: .4s / .35s + .1s per line)
  splitLines(tag, { lineClass: 'moveUpF', delayStart: 0.3 });
  splitLines(heading, { lineClass: 'moveUp', delayStart: 0.25 });

  // start every image at -200vw (matches the CSS translateZ(-200vw))
  gsap.set(imgs, { z: () => -2 * window.innerWidth });

  let scrollCtx = null;

  const buildScroll = () => {
    if (reduced || isPhone()) return;   // the source skips the fly-through on phones (header is only 100svh there)
    scrollCtx = gsap.context(() => {
      gsap
        .timeline()
        .to(imgs, {
          z: window.innerWidth, stagger: 0.1, ease: 'io1',
          scrollTrigger: { trigger: header, start: 'clamp(0% 0%)', end: 'clamp(100% 60%)', scrub: true },
        })
        .to(imgs, {
          opacity: 1, stagger: 0.3, ease: 'linear',
          scrollTrigger: { trigger: header, start: 'clamp(0% 0%)', end: 'clamp(70% 0%)', scrub: true },
        }, '<');
    }, header);
  };

  const intro = gsap.timeline({ paused: true, onComplete: buildScroll });
  [0, 1, 2].forEach((i, k) => {
    const el = imgs[i];
    if (!el) return;
    intro
      .to(el, { z: 0, ease: 'o3', duration: 0.8, ...(k === 0 ? { delay: 2.4 } : {}) }, k === 0 ? undefined : '<20%')
      .to(el, { opacity: 1, ease: 'o3', duration: 0.8 }, '<');
  });

  return {
    /** Called when the preloader hands over. */
    playIntro: () => intro.play(),
    destroy: () => { intro.kill(); scrollCtx && scrollCtx.revert(); },
  };
}
