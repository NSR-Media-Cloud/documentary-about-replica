// Before/after captures of the four motion states touched by the layout-transition clean-up:  node motion-shots.cjs <tag>
//   film-grid hover · video-slider active frame · icon-text open tab · quiz open
const { launch, openPage, waitReady, sleep, path, SP } = require('./lib.cjs');
const tag = process.argv[2] || 'before';
const OUT = path.join(SP, 'shots2');
const base = 'http://localhost:4660';
async function open(b, url, vw = 1440) {
  const p = await openPage(b, { vw, vh: 900, url: base + url, blockThird: true, suppressPopup: true });
  await p.evaluate(() => { try { sessionStorage.setItem('rta-seen', '1'); } catch (e) {} });
  await p.reload({ waitUntil: 'domcontentloaded' }); await waitReady(p); await sleep(2200);
  return p;
}
async function clipOf(p, sel, pad = 0) {
  return p.evaluate((s, pd) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { x: Math.max(0, r.x - pd), y: r.y + scrollY - pd, width: Math.min(innerWidth, r.width + 2 * pd), height: r.height + 2 * pd }; }, sel, pad);
}
(async () => {
  const b = await launch();
  // 1 film grid hover (card 5)
  let p = await open(b, '/funding');
  await p.evaluate(() => document.querySelectorAll('.film-grid__card')[4].scrollIntoView({ block: 'center' })); await sleep(1200);
  const r = await p.evaluate(() => { const x = document.querySelectorAll('.film-grid__card')[4].getBoundingClientRect(); return { x: x.x, y: x.y, w: x.width, h: x.height }; });
  await p.mouse.move(r.x + r.w / 2, r.y + 100, { steps: 6 }); await sleep(1500);
  await p.screenshot({ path: path.join(OUT, `motion-${tag}-filmgrid.png`), clip: { x: r.x - 12, y: r.y + (await p.evaluate(() => scrollY)) - 12, width: r.w + 24, height: r.h + 24 } });
  await p.close();
  // 2 video slider: active frame of slide 1 and, after clicking next slide, slide 2 (mid-way is not captured; final state only)
  p = await open(b, '/courses/nonfiction-foundations');
  await p.evaluate(() => document.querySelector('.video-slider__viewport').scrollIntoView({ block: 'center' })); await sleep(1500);
  await p.screenshot({ path: path.join(OUT, `motion-${tag}-slider.png`), clip: await clipOf(p, '.video-slider__wrap', 0) });
  await p.evaluate(() => document.querySelectorAll('.video-slider__slide')[1].scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' })); await sleep(1200);
  await p.screenshot({ path: path.join(OUT, `motion-${tag}-slider2.png`), clip: await clipOf(p, '.video-slider__wrap', 0) });
  await p.close();
  // 3 icon-text: open the second tab
  p = await open(b, '/');
  await p.evaluate(() => document.querySelector('[data-icon-text]').scrollIntoView({ block: 'center' })); await sleep(900);
  await p.evaluate(() => document.querySelectorAll('.icon-text__button')[1].click()); await sleep(1300);
  await p.screenshot({ path: path.join(OUT, `motion-${tag}-icontext.png`), clip: await clipOf(p, '.icon-text__list', 6) });
  const pageH = await p.evaluate(() => document.documentElement.scrollHeight);
  // 4 quiz: open and show the first question
  await p.evaluate(() => document.querySelector('[data-quiz]').scrollIntoView({ block: 'start' })); await sleep(800);
  await p.evaluate(() => document.querySelector('[data-quiz-toggle]').click()); await sleep(1300);
  await p.screenshot({ path: path.join(OUT, `motion-${tag}-quiz.png`), clip: await clipOf(p, '[data-quiz]', 0) });
  const q = await p.evaluate(() => { const f = document.querySelector('[data-quiz-form]'); return { formH: Math.round(f.getBoundingClientRect().height), pageH: document.documentElement.scrollHeight }; });
  console.log(tag, 'home page height with tab+quiz open', JSON.stringify(q), '(page height after tab open', pageH + ')');
  await p.close();
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
