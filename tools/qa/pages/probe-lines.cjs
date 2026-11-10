const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
(async () => {
  const b = await launch();
  const page = await openPage(b, { vw: 1440, vh: 900, url: 'https://theartofdocumentary.com/short-documentary-competition', blockThird: true, suppressPopup: true });
  await waitReady(page); await sleep(2500);
  const sec = await page.evaluate(() => { const s = document.querySelector('[class*=imageBlocks_section]'); const r = s.getBoundingClientRect(); const g = document.querySelector('[class*=imageBlocks_grid]').getBoundingClientRect(); return { top: r.top + scrollY, h: r.height, gridTop: g.top + scrollY, gridH: g.height }; });
  console.log('section', JSON.stringify(sec));
  const read = () => page.evaluate(() => [...document.querySelectorAll('[class*=imageBlocks_lines] > div')].map((d) => { const cs = getComputedStyle(d); const a = getComputedStyle(d, '::after'); return `${d.dataset.line}@${d.style.top}: --scale=${cs.getPropertyValue('--scale').trim() || '-'} ${a.transform.slice(0, 40)}`; }));
  for (const y of [900, 1300, 1700, 2000, 2400, 2700]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(1500);
    const r = await read();
    console.log(y, r.slice(0, 4).join(' | '), '...', r[3]);
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
