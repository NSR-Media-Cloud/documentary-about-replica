// Film grid behaviour on the original (or replica): node probe-film.cjs <orig|rep> <route-no-slash>
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
const which = process.argv[2], route = process.argv[3];
const BASE = which === 'orig' ? 'https://theartofdocumentary.com/' : 'http://localhost:4660/';
const SEL = which === 'orig' ? '[class*=filmGrid_card]' : '.film-grid__card';
const BTN = which === 'orig' ? '[class*=filmGrid_button]' : '.film-grid__button';
(async () => {
  const b = await launch();
  for (const vw of [1440, 390]) {
    const page = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: BASE + route, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    await waitReady(page); await sleep(2500);
    const info = () => page.evaluate((sel, btn) => {
      const cards = [...document.querySelectorAll(sel)];
      const vis = cards.filter((c) => { const r = c.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(c).display !== 'none'; });
      const bt = document.querySelector(btn); const br = bt && bt.getBoundingClientRect();
      return { total: cards.length, visible: vis.length, btnDisplay: bt ? getComputedStyle(bt).display : null, btnRect: br && [Math.round(br.x), Math.round(br.y + scrollY), Math.round(br.width), Math.round(br.height)] };
    }, SEL, BTN);
    console.log(vw, 'initial', JSON.stringify(await info()));
    if (vw <= 480) {
      for (let i = 0; i < 3; i++) {
        const clicked = await page.evaluate((btn) => { const bt = document.querySelector(btn); if (!bt || getComputedStyle(bt).display === 'none') return false; bt.scrollIntoView({ block: 'center' }); bt.click(); return true; }, BTN);
        await sleep(1200);
        console.log(vw, 'after click', i + 1, clicked, JSON.stringify(await info()));
      }
    }
    await page.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
