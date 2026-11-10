// With prefers-reduced-motion: reduce, nothing on the page may keep moving on its own:
//   · no running CSS animation (on an element or its ::before / ::after) that repeats forever
//   · no running GSAP timeline that repeats forever (the marquees and the enterprise demos)
// Each case is run twice. With motion allowed the detector must find loops on the pages that have them (proof that it can fail);
// with reduce it must find none.   usage: node check-reduced-motion.cjs [base-url]
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
const BASE = process.argv[2] || process.env.BASE || 'http://localhost:4660';

// [route, what to do once the page is ready ('click' | 'class' = add .is-show | 'scroll' = bring into view), selector, expectLoopsWhenMotionAllowed]
const CASES = [
  ['/', null, null, true],
  ['/', 'click', '.hero-centered [data-watch]', true],               // the lightbox player (its picture slowly pushes in)
  ['/about', null, null, false],
  ['/courses', null, null, true],                                     // blinking dot on the active toggle + marquees
  ['/courses/short-film-playbook', null, null, true],                 // banner ticker + hero push-in
  ['/funding', 'class', '.film-grid__visuals', true],                 // the hover preview on the film grid
  ['/short-documentary-competition', null, null, true],
  ['/enterprise', 'scroll', '[data-demo]', true],                     // logo strip + the looping demos (they only run while on screen)
  ['/the-rta-accelerator', null, null, false],
];

async function loops(page) {
  return page.evaluate(() => {
    const label = (t, pe) => (t ? t.tagName.toLowerCase() + (typeof t.className === 'string' && t.className.trim() ? '.' + t.className.trim().split(/\s+/).join('.') : '') : '?') + (pe || '');
    const css = document.getAnimations()
      .filter((a) => a.playState === 'running' && a.effect && a.effect.getTiming().iterations === Infinity)
      .map((a) => `${label(a.effect.target, a.effect.pseudoElement)} · ${a.animationName || 'script'}`);
    const js = window.gsap
      ? gsap.globalTimeline.getChildren(true, false, true).filter((t) => t.repeat() === -1 && t.isActive() && !t.paused()).map(() => 'gsap timeline (repeat -1)')
      : [];
    return [...new Set([...css, ...js])];
  });
}

(async () => {
  const browser = await launch();
  let bad = 0, blind = 0;
  for (const [route, how, sel, expectLoops] of CASES.filter((c) => !process.env.ONLY || c[0].includes(process.env.ONLY))) {   // ONLY=enterprise → just that route
    const row = {};
    for (const reducedMotion of [false, true]) {
      const page = await openPage(browser, { vw: 1440, vh: 900, url: BASE + route, blockThird: true, reducedMotion });
      await page.evaluate(() => { try { sessionStorage.setItem('popup', 'disabled'); sessionStorage.setItem('rta-seen', '1'); } catch (e) {} });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await waitReady(page); await sleep(1800);
      if (how) {
        await page.evaluate((h, s) => {
          const e = document.querySelector(s); if (!e) return;
          e.scrollIntoView({ block: 'center' });
          if (h === 'click') e.click(); else if (h === 'class') e.classList.add('is-show');
        }, how, sel);
        await sleep(1200);
      }
      row[reducedMotion ? 'reduce' : 'allowed'] = await loops(page);
      await page.close();
    }
    const fail = row.reduce.length > 0;
    const blindSpot = expectLoops && row.allowed.length === 0;   // the detector saw nothing even with motion allowed — the case proves nothing
    if (fail) bad++;
    if (blindSpot) blind++;
    console.log(`${fail ? 'FAIL' : blindSpot ? 'WARN' : 'ok  '} ${(route + (how === 'click' ? '  (+player)' : how === 'class' ? '  (+preview)' : how === 'scroll' ? '  (+demos)' : '')).padEnd(46)} loops: motion allowed ${String(row.allowed.length).padStart(2)} → reduce ${row.reduce.length}`);
    if (process.env.VERBOSE) row.allowed.forEach((l) => console.log('       loops when motion is allowed:', l));
    if (fail) row.reduce.forEach((l) => console.log('       still moving:', l));
  }
  console.log(bad ? `${bad} page(s) keep looping under reduced motion` : 'nothing loops under reduced motion' + (blind ? ` (${blind} case(s) had no loops to begin with — see WARN)` : ''));
  await browser.close();
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
