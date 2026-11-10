const { launch, openPage, waitReady, sleep, path, SP } = require('./lib.cjs');
(async () => {
  const b = await launch();
  const page = await openPage(b, { vw: 390, vh: 844, url: 'http://localhost:4660/funding', blockThird: true, suppressPopup: true, mobile: true });
  const errs = []; page.on('pageerror', (e) => errs.push(String(e.message))); page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await waitReady(page); await sleep(2000);
  const info = () => page.evaluate(() => ({ cards: [...document.querySelectorAll('.film-grid__card')].filter((c) => getComputedStyle(c).display !== 'none').length, btn: !!document.querySelector('.film-grid__button'), all: document.querySelector('.film-grid').classList.contains('is-all') }));
  console.log('initial', JSON.stringify(await info()));
  await page.evaluate(() => document.querySelector('.film-grid__button').scrollIntoView({ block: 'center' }));
  await sleep(800);
  await page.evaluate(() => document.querySelector('.film-grid__button').click()); await sleep(500);
  console.log('after load more', JSON.stringify(await info()));
  await page.evaluate(() => document.querySelector('.film-grid__card').click()); await sleep(2500);
  await page.screenshot({ path: path.join(SP, 'shots2', 'rep-player-mobile.png') });
  const r = await page.evaluate(() => { const g = (s) => { const e = document.querySelector(s); if (!e) return null; const x = e.getBoundingClientRect(); return [Math.round(x.x), Math.round(x.y), Math.round(x.width), Math.round(x.height)]; }; return { stage: g('.player__stage'), frame: g('.player__frame'), info: g('.player__info'), close: g('.player__close'), timeline: g('.player__timeline') }; });
  console.log(JSON.stringify(r), 'errors:', errs.length ? errs : 'none');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
