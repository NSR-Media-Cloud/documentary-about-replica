const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
(async () => {
  const b = await launch();
  const p = await openPage(b, { vw: 1440, vh: 900, url: 'http://localhost:4660/courses/nonfiction-foundations', blockThird: true, suppressPopup: true });
  await p.evaluate(() => { try { sessionStorage.setItem('rta-seen', '1'); } catch (e) {} });
  await p.reload({ waitUntil: 'domcontentloaded' }); await waitReady(p); await sleep(2000);
  await p.evaluate(() => document.querySelector('.video-slider__viewport').scrollIntoView({ block: 'center' })); await sleep(2500);
  const state = () => p.evaluate(() => [...document.querySelectorAll('.video-slider__video')].map((v, i) => { const m = new DOMMatrix(getComputedStyle(v).transform); const s = v.querySelector('.video-slider__play svg'); const ms = new DOMMatrix(getComputedStyle(s).transform); return `${i}:${v.classList.contains('is-active') ? 'A' : '-'} s=${m.a.toFixed(3)} op=${(+getComputedStyle(v).opacity).toFixed(1)} icon=${ms.a.toFixed(3)} box=${Math.round(v.getBoundingClientRect().width)}x${Math.round(v.getBoundingClientRect().height)}`; }).slice(0, 4).join(' | '));
  console.log('start  ', await state());
  await p.evaluate(() => document.querySelectorAll('.video-slider__slide')[2].scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' })); await sleep(1200);
  console.log('slide 3', await state());
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
