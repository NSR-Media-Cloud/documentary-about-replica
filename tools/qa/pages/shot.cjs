// Screenshots of the original or replica.
//   node shot.cjs <orig|rep> <name> <vw> overview [scale=0.3]            one full-page image
//   node shot.cjs <orig|rep> <name> <vw> slices [scale=0.5] [fromY] [toY] viewport-sized slices (real scrolling, so scroll-driven states show)
//   node shot.cjs <orig|rep> <name> <vw> at <y> [scale=0.8]              one viewport screenshot with the page scrolled to y
// Files land in tools/qa/out/pages/shots2/<which>-<name>-<vw>-<tag>.jpg
const { launch, openPage, waitReady, sleep, fs, path, SP } = require('./lib.cjs');
const ROUTES = require('./routes.cjs');
const OUT = path.join(SP, 'shots2');
fs.mkdirSync(OUT, { recursive: true });
const BASES = { orig: 'https://theartofdocumentary.com', rep: 'http://localhost:4660' };
const [which, name, vwS = '1440', mode = 'overview', a1, a2, a3] = process.argv.slice(2);
const vw = +vwS, vh = vw <= 480 ? 844 : 900;

(async () => {
  const row = ROUTES.find((r) => r[0] === name);
  const scale = mode === 'overview' ? +(a1 || 0.3) : mode === 'at' ? +(a2 || 0.8) : +(a1 || 0.5);
  const browser = await launch();
  const page = await openPage(browser, { vw, vh, dpr: scale, url: BASES[which] + (which === 'orig' ? row[1] : row[2]), blockThird: true, suppressPopup: true, mobile: vw <= 480 });
  await waitReady(page);
  await sleep(1500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const pre = async () => { for (let y = 0; y < H + vh; y += Math.round(vh * 0.55)) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(200); } await sleep(1000); };
  const files = [];
  const snap = async (tag) => { const f = path.join(OUT, `${which}-${name}-${vw}-${tag}.jpg`); await page.screenshot({ path: f, type: 'jpeg', quality: 72 }); files.push(f); };
  if (mode === 'overview') {
    await pre();
    await page.evaluate(() => window.scrollTo(0, 0)); await sleep(900);
    const f = path.join(OUT, `${which}-${name}-${vw}-overview.jpg`);
    await page.screenshot({ path: f, type: 'jpeg', quality: 70, fullPage: true });
    files.push(f);
  } else if (mode === 'slices') {
    await pre();
    const from = +(a2 || 0), to = +(a3 || H);
    for (let y = from, i = 0; y < to; y += vh, i++) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(900);
      await snap(String(Math.round(y)).padStart(5, '0'));
    }
  } else if (mode === 'at') {
    await pre();
    await page.evaluate((yy) => window.scrollTo(0, yy), +a1);
    await sleep(1100);
    await snap('y' + Math.round(+a1));
  }
  console.log(`page height ${H}\n` + files.join('\n'));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
