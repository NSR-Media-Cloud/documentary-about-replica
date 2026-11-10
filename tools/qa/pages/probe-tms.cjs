const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
(async () => {
  const b = await launch();
  for (const vw of [1440, 390]) {
    const page = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: 'https://theartofdocumentary.com/enterprise', blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    await waitReady(page); await sleep(2500);
    const r = await page.evaluate(() => {
      const g = (e) => { const x = e.getBoundingClientRect(); return [Math.round(x.x * 10) / 10, Math.round((x.y + scrollY) * 10) / 10, Math.round(x.width * 10) / 10, Math.round(x.height * 10) / 10].join(','); };
      const sec = document.querySelector('[class*=textMediaStack_section]');
      const out = { section: g(sec), header: g(sec.querySelector('header')), stack: g(sec.querySelector('[class*=textMediaStack_stack]')) };
      out.cards = [...sec.querySelectorAll('[class*=textMediaStack_card]')].map((c) => ({ card: g(c), inner: g(c.querySelector('[class*=inner]')), head: g(c.querySelector('[class*=header]')), counter: g(c.querySelector('[class*=inner] > [class*=monoS]')), vline: g(c.querySelector('[class*=vline]')), video: g(c.querySelector('[class*=_video]')), vid: (() => { const v = c.querySelector('video'); return v ? [g(v), v.videoWidth, v.videoHeight] : null; })() }));
      const ct = document.querySelector('[class*=centeredText_section]'); out.centered = g(ct);
      return out;
    });
    console.log(vw, JSON.stringify(r, null, 1).replace(/\n\s+/g, ' '));
    await page.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
