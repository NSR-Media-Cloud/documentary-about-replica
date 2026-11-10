// Static equivalence of the old (width/height) and new (transform + clip-path) implementations, end states with transitions and animations off.
//   node equiv-shots.cjs  → writes equiv-<name>-old.png / equiv-<name>-new.png, then run pixdiff.cjs on each pair
const { launch, openPage, waitReady, sleep, path, SP } = require('./lib.cjs');
const OUT = path.join(SP, 'shots2'); const base = 'http://localhost:4660';
const OLD = {
  filmgrid: '.film-grid__card:hover .film-grid__image img,.film-grid__card:hover .film-grid__video{transform:none!important;clip-path:none!important;width:424rem!important;height:228rem!important}',
  slider: '.video-slider__video.is-active{transform:none!important;clip-path:none!important;width:896rem!important;height:494rem!important}.video-slider__video.is-active .video-slider__play svg{transform:none!important}',
};
const FREEZE = '.film-grid__preview{animation:none!important}*{transition:none!important}';
async function page(b, url) {
  const p = await openPage(b, { vw: 1440, vh: 900, url: base + url, blockThird: true, suppressPopup: true });
  await p.evaluate(() => { try { sessionStorage.setItem('rta-seen', '1'); } catch (e) {} });
  await p.reload({ waitUntil: 'domcontentloaded' }); await waitReady(p); await sleep(2000);
  return p;
}
(async () => {
  const b = await launch();
  for (const variant of ['old', 'new']) {
    // film grid hover end state
    let p = await page(b, '/funding');
    await p.addStyleTag({ content: FREEZE + (variant === 'old' ? OLD.filmgrid : '') });
    await p.evaluate(() => document.querySelectorAll('.film-grid__card')[4].scrollIntoView({ block: 'center' })); await sleep(1000);
    const r = await p.evaluate(() => { const x = document.querySelectorAll('.film-grid__card')[4].getBoundingClientRect(); return { x: x.x, y: x.y + scrollY, w: x.width, h: x.height }; });
    await p.mouse.move(r.x + r.w / 2, r.y - (await p.evaluate(() => scrollY)) + 100, { steps: 6 }); await sleep(700);
    await p.screenshot({ path: path.join(OUT, `equiv-filmgrid-${variant}.png`), clip: { x: r.x - 12, y: r.y - 12, width: r.w + 24, height: r.h + 24 } });
    await p.close();
    // video slider: first slide active, second inactive
    p = await page(b, '/courses/nonfiction-foundations');
    await p.addStyleTag({ content: FREEZE + (variant === 'old' ? OLD.slider : '') });
    await p.evaluate(() => document.querySelector('.video-slider__viewport').scrollIntoView({ block: 'center' })); await sleep(1200);
    const c = await p.evaluate(() => { const e = document.querySelector('.video-slider__wrap').getBoundingClientRect(); return { x: 0, y: e.y + scrollY, width: 1440, height: e.height }; });
    await p.screenshot({ path: path.join(OUT, `equiv-slider-${variant}.png`), clip: c });
    await p.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
