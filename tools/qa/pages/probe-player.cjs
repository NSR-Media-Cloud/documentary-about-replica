const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
(async () => {
  const b = await launch();
  for (const vw of [1440, 390]) {
    const page = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: 'https://theartofdocumentary.com/funding', blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    await waitReady(page); await sleep(2500);
    await page.evaluate(() => { const g = document.querySelector('[class*=filmGrid_grid]'); g.scrollIntoView({ block: 'center' }); });
    await sleep(1500);
    await page.evaluate(() => document.querySelector('[class*=filmGrid_card]').click());
    await sleep(3500);
    const out = await page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const h = (s) => { const e = q(s); return e ? e.outerHTML.replace(/\s+class="[^"]*"/g, '').slice(0, 700) : null; };
      const r = (s) => { const e = q(s); if (!e) return null; const x = e.getBoundingClientRect(); return [Math.round(x.x), Math.round(x.y), Math.round(x.width), Math.round(x.height)]; };
      return {
        marker: h('[class*=videoModal_marker]'), volBtn: h('[class*=videoModal_volume] button'), fs: h('[class*=videoModal_fullscreen]'),
        container: r('[class*=videoModal_container]'), video: r('[class*=videoModal_video]'), info: r('[class*=videoModal_info]'), close: r('[class*=videoModal_close]'), timeline: r('[class*=videoModal_timeline]'), cursor: r('[class*=cursor_wrap]'),
        cls: q('[class*=videoModal_container]').className.replace(/videoModal_|__\w+/g, ''),
        videoCss: (() => { const v = q('[class*=videoModal_video]'); const s = getComputedStyle(v); return [s.objectFit, s.width, s.height, v.paused, v.muted, v.volume, v.loop, v.currentTime.toFixed(1), v.duration]; })(),
        cursorTxt: q('[class*=cursor_wrap]') && q('[class*=cursor_wrap]').textContent, cursorCls: q('[class*=cursor_wrap]') && q('[class*=cursor_wrap]').className.replace(/cursor_|__\w+/g, ''), cursorStyle: q('[class*=cursor_wrap]') && q('[class*=cursor_wrap]').getAttribute('style'),
      };
    });
    console.log(vw, JSON.stringify(out, null, 1));
    await page.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
