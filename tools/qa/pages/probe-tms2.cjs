const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
(async () => {
  const b = await launch();
  for (const vw of [1440, 390]) {
    const page = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: 'https://theartofdocumentary.com/enterprise', blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    await waitReady(page); await sleep(2500);
    const n = await page.evaluate(() => document.querySelectorAll('[class*=textMediaStack_card]').length);
    for (let i = 0; i < n; i++) {
      await page.evaluate((k) => { const c = document.querySelectorAll('[class*=textMediaStack_card]')[k]; const y = c.getBoundingClientRect().top + scrollY; window.scrollTo(0, y - (innerWidth <= 480 ? 100 : 0)); }, i);
      await sleep(3500);
      const r = await page.evaluate((k) => {
        const c = document.querySelectorAll('[class*=textMediaStack_card]')[k]; const v = c.querySelector('video'); const box = c.querySelector('[class*=_video]'); const g = (e) => { const x = e.getBoundingClientRect(); return [Math.round(x.width * 10) / 10, Math.round(x.height * 10) / 10]; };
        return { card: g(c), box: g(box), video: g(v), vw: v.videoWidth, vh: v.videoHeight, rs: v.readyState, dur: v.duration, src: (v.currentSrc || '').slice(-50), loop: v.loop, muted: v.muted };
      }, i);
      console.log(vw, i, JSON.stringify(r));
    }
    await page.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
