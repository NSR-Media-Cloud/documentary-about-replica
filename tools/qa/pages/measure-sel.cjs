// Height of one element on the built replica page at 1440 and 390:  node measure-sel.cjs <route-no-slash> "<selector>"
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
const [route, sel] = process.argv.slice(2);
(async () => {
  const b = await launch(); const out = [];
  for (const vw of [1440, 390]) {
    const p = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: 'http://localhost:4660/' + route, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    await waitReady(p); await sleep(1500);
    out.push(await p.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().height * 10) / 10, sel));
    await p.close();
  }
  console.log(route, sel, out.join(' / ')); await b.close();
})();
