// Do the "open something" buttons on the new pages actually open it?  (player lightbox / subscribe popup)
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
const CASES = [
  ['/', '.hero-centered [data-watch]', 'player'], ['/', '.home-cards__card [data-open-subscribe]', 'popup'], ['/', '[data-quiz] .quiz__media', 'player'],
  ['/funding', '.film-grid__card', 'player'], ['/short-documentary-competition', '.info-video [data-watch]', 'player'], ['/short-documentary-competition', '.full-video__btn', 'player'],
  ['/short-documentary-competition', '.film-stack__btn', 'player'], ['/courses/short-film-playbook', '.short-hero [data-open-subscribe]', 'popup'], ['/the-rta-accelerator', '.info-video [data-open-subscribe]', 'popup'],
];
(async () => {
  const b = await launch(); let bad = 0;
  for (const [route, sel, kind] of CASES) {
    const page = await openPage(b, { vw: 1440, vh: 900, url: 'http://localhost:4660' + route, blockThird: true, suppressPopup: false });
    await page.evaluate(() => { try { sessionStorage.setItem('popup', 'disabled'); sessionStorage.setItem('rta-seen', '1'); } catch (e) {} });
    await page.reload({ waitUntil: 'domcontentloaded' }); await waitReady(page); await sleep(1800);
    const found = await page.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.scrollIntoView({ block: 'center' }); return true; }, sel);
    await sleep(500);
    let ok = false;
    if (found) {
      await page.evaluate((s) => document.querySelector(s).click(), sel); await sleep(900);
      ok = await page.evaluate((k) => k === 'player' ? !!document.querySelector('.player') : (() => { const p = document.querySelector('#popup'); return !!p && !p.hasAttribute('hidden') && getComputedStyle(p).visibility !== 'hidden'; })(), kind);
    }
    if (!ok) bad++;
    console.log(ok ? 'ok  ' : 'FAIL', route.padEnd(34), sel.padEnd(44), '→', kind, found ? '' : '(selector not found)');
    await page.close();
  }
  console.log(bad ? bad + ' problem(s)' : 'all triggers work');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
