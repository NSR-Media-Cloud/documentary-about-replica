// Player states: node shot-player.cjs <orig|rep> <route> "<card selector>"
const { launch, openPage, waitReady, sleep, path, SP } = require('./lib.cjs');
const [which, route, sel] = process.argv.slice(2);
const BASE = which === 'orig' ? 'https://theartofdocumentary.com/' : 'http://localhost:4660/';
(async () => {
  const b = await launch();
  const page = await openPage(b, { vw: 1440, vh: 900, url: BASE + route, blockThird: true, suppressPopup: true });
  await waitReady(page); await sleep(2500);
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
  await sleep(1500);
  await page.evaluate((s) => document.querySelector(s).click(), sel);
  await sleep(3000);
  const shot = async (tag) => { const f = path.join(SP, 'shots2', `${which}-player-${tag}.png`); await page.screenshot({ path: f }); console.log(f); };
  await page.mouse.move(500, 400, { steps: 5 }); await page.mouse.move(720, 430, { steps: 8 }); await sleep(500); await shot('center');
  await page.mouse.move(640, 868, { steps: 10 }); await sleep(700); await shot('bar');
  const vol = which === 'orig' ? '[class*=videoModal_volume] button' : '.player__volume button';
  const vr = await page.evaluate((s) => { const x = document.querySelector(s).getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2 }; }, vol);
  await page.mouse.move(vr.x, vr.y, { steps: 10 }); await sleep(700); await shot('volume');
  await page.mouse.move(vr.x, vr.y - 30, { steps: 5 }); await sleep(400); await shot('volume2');
  await page.mouse.move(720, 400, { steps: 5 }); await sleep(5000); await shot('idle');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
