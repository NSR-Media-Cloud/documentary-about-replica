const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
(async () => {
  const b = await launch();
  const page = await openPage(b, { vw: 1440, vh: 900, url: 'https://theartofdocumentary.com/funding', blockThird: true, suppressPopup: true });
  await waitReady(page); await sleep(2500);
  const st = () => page.evaluate(() => {
    const cs = [...document.querySelectorAll('[class*=filmGrid_card]')];
    return cs.slice(0, 3).map((c) => {
      const v = c.querySelector('[class*=filmGrid_visuals]'); const im = c.querySelector('[class*=filmGrid_image] img'); const vid = c.querySelector('video');
      const r = (e) => { const x = e.getBoundingClientRect(); return [Math.round(x.width), Math.round(x.height)]; };
      return { op: getComputedStyle(c).opacity, vis: v.className.replace(/filmGrid_|__\w+/g, ''), img: r(im), imgOp: getComputedStyle(im.closest('picture')).opacity, vid: vid && [r(vid), vid.paused, vid.currentTime.toFixed(2), vid.readyState, (vid.currentSrc || '').slice(-40)], bg: getComputedStyle(v).backgroundSize };
    });
  });
  console.log('idle', JSON.stringify(await st()));
  await page.evaluate(() => document.querySelector('[class*=filmGrid_grid]').scrollIntoView({ block: 'center' }));
  await sleep(1500);
  const rect = await page.evaluate(() => { const x = document.querySelector('[class*=filmGrid_card]').getBoundingClientRect(); return { x: x.x, y: x.y, w: x.width, h: x.height }; });
  console.log('card rect', JSON.stringify(rect));
  await page.mouse.move(rect.x + rect.w / 2, rect.y + 100, { steps: 6 });
  for (const t of [150, 400, 900, 1800]) { await sleep(t === 150 ? 150 : t - [0, 150, 400, 900][[150, 400, 900, 1800].indexOf(t)]); console.log('hover', t, JSON.stringify(await st())); }
  await page.mouse.click(rect.x + rect.w / 2, rect.y + 100);
  await sleep(2000);
  const modal = await page.evaluate(() => { const m = document.querySelector('#modal'); return m ? m.innerHTML.length : -1; });
  console.log('modal html len', modal);
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
