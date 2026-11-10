// Hover screenshot: node shot-hover.cjs <orig|rep> <route-no-slash> "<css selector (use [class*=x] for orig)>" [nth=0] [vw=1440] [waitMs=1200] [out-tag]
const { launch, openPage, waitReady, sleep, path, SP } = require('./lib.cjs');
const [which, route, sel, nthS = '0', vwS = '1440', waitS = '1200', tag = 'hover'] = process.argv.slice(2);
const BASE = which === 'orig' ? 'https://theartofdocumentary.com/' : 'http://localhost:4660/';
(async () => {
  const b = await launch(); const vw = +vwS;
  const page = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: BASE + route, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
  await waitReady(page); await sleep(2000);
  const r = await page.evaluate((s, n) => { const el = document.querySelectorAll(s)[n]; el.scrollIntoView({ block: 'center' }); return 1; }, sel, +nthS);
  await sleep(1500);
  const rect = await page.evaluate((s, n) => { const x = document.querySelectorAll(s)[n].getBoundingClientRect(); return { x: x.x, y: x.y, w: x.width, h: x.height }; }, sel, +nthS);
  await page.mouse.move(rect.x + rect.w / 2, rect.y + rect.h / 2, { steps: 8 });
  await sleep(+waitS);
  const out = path.join(SP, 'shots2', `${which}-${route.replace(/\W+/g, '_')}-${vw}-${tag}.png`);
  await page.screenshot({ path: out });
  console.log(out);
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
