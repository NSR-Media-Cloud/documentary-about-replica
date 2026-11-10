// Document height of a page at 390 before and after its lazy videos have loaded (scroll through slowly):  node probe-loaded-height.cjs <orig-route-no-slash>
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
const route = process.argv[2] || 'courses/documentary-foundations';
(async () => {
  const b = await launch();
  const page = await openPage(b, { vw: 390, vh: 844, url: 'https://theartofdocumentary.com/' + route, blockThird: true, suppressPopup: true, mobile: true });
  await waitReady(page); await sleep(2500);
  const h0 = await page.evaluate(() => document.documentElement.scrollHeight);
  let h = h0;
  for (let y = 0; y < 16000; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(1100);
    h = await page.evaluate(() => document.documentElement.scrollHeight);
    if (y > h + 600) break;
  }
  const vids = await page.evaluate(() => [...document.querySelectorAll('video')].map((v) => [Math.round(v.getBoundingClientRect().width), Math.round(v.getBoundingClientRect().height), v.videoWidth, v.videoHeight, v.readyState].join('x')).filter((s) => !/^0x0/.test(s)));
  console.log('before', h0, 'after', h, 'diff', h - h0); console.log(vids.slice(0, 14).join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
