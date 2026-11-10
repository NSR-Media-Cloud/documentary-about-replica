const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
(async () => {
  const b = await launch();
  const page = await openPage(b, { vw: 1440, vh: 900, url: 'https://theartofdocumentary.com/enterprise', blockThird: true, suppressPopup: true });
  await waitReady(page); await sleep(2500);
  await page.evaluate(() => document.querySelector('[class*=logoMarquee_section]').scrollIntoView({ block: 'center' }));
  await sleep(1500);
  const read = () => page.evaluate(() => {
    const c = document.querySelector('[class*=slider_container]'); const s = [...c.children];
    const m = getComputedStyle(c).transform;
    return { tf: m, n: s.length, first: Math.round(s[0].getBoundingClientRect().x * 10) / 10, w0: Math.round(s[0].getBoundingClientRect().width), cw: Math.round(c.getBoundingClientRect().width), vw: Math.round(c.parentElement.getBoundingClientRect().width), ts: performance.now() };
  });
  const a = await read(); await sleep(2000); const c = await read(); await sleep(4000); const d = await read();
  console.log(JSON.stringify(a)); console.log(JSON.stringify(c)); console.log(JSON.stringify(d));
  console.log('px/s (2s):', ((a.first - c.first) / ((c.ts - a.ts) / 1000)).toFixed(1), ' (4s):', ((c.first - d.first) / ((d.ts - c.ts) / 1000)).toFixed(1));
  const logos = await page.evaluate(() => [...document.querySelectorAll('[class*=logoMarquee_sliderSlide]')].slice(0, 20).map((s) => { const r = s.getBoundingClientRect(); const im = s.querySelector('img'); const ir = im.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height), Math.round(ir.width), Math.round(ir.height)].join(','); }));
  console.log(logos.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
