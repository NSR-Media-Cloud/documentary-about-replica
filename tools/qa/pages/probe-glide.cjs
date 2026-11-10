const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
(async () => {
  const b = await launch();
  const page = await openPage(b, { vw: 1440, vh: 900, url: 'https://theartofdocumentary.com/', blockThird: true, suppressPopup: true });
  await waitReady(page); await sleep(3000);
  const geo = await page.evaluate(() => {
    const s = document.querySelector('[class*=glideTrack_section]'); const l = s.querySelector('[class*=glideTrack_list]'); const g = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)].join(','); };
    return { section: g(s), header: g(s.querySelector('header')), list: g(l), band: g(l.querySelector('[class*=glideTrack_band]')), items: [...l.querySelectorAll('[class*=glideTrack_item]')].map(g), groups: [...l.querySelectorAll('[class*=glideTrack_group]')].map(g) };
  });
  console.log(JSON.stringify(geo));
  for (const y of [900, 1100, 1300, 1400, 1500, 1600, 1700, 1800, 1900]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(1400);
    const r = await page.evaluate(() => { const l = document.querySelector('[class*=glideTrack_list]'); const bd = l.querySelector('[class*=glideTrack_band]'); const t = l.querySelector('[class*=glideTrack_titles]'); const br = bd.getBoundingClientRect(); return { bandTopVp: Math.round(br.top), bandTf: getComputedStyle(bd).transform, titlesTf: getComputedStyle(t).transform }; });
    console.log(y, JSON.stringify(r));
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
