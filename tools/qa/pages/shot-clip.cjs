// Clip screenshot of the viewport after scrolling to y:  node shot-clip.cjs <orig|rep> <route> <vw> <scrollY> <x> <y> <w> <h> <tag> [waitMs]
const { launch, openPage, waitReady, sleep, path, SP } = require('./lib.cjs');
const [which, route, vwS, yS, x, y, w, h, tag, waitS = '1500'] = process.argv.slice(2);
const BASE = which === 'orig' ? 'https://theartofdocumentary.com/' : 'http://localhost:4660/';
(async () => {
  const b = await launch(); const vw = +vwS;
  const page = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: BASE + route, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
  await waitReady(page); await sleep(2500);
  await page.evaluate((yy) => { window.scrollTo(0, yy); }, +yS);
  await sleep(+waitS);
  const out = path.join(SP, 'shots2', `${which}-${route.replace(/\W+/g, '_')}-${vw}-${tag}.png`);
  const sy = await page.evaluate(() => window.scrollY);
  await page.screenshot({ path: out, clip: { x: +x, y: sy + +y, width: +w, height: +h } });
  console.log(out);
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
