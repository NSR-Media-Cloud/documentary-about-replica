// Line counts of candidate strings inside a cloned element, at desktop and phone.  node try-text.cjs <url-path-no-slash> "<selector of element to clone>" "<inner selector for text>" cand1 cand2 ...
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
const [route, sel, inner, ...cands] = process.argv.slice(2);
(async () => {
  const b = await launch();
  for (const vw of [1440, 390]) {
    const page = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: 'http://localhost:4660/' + route, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    await waitReady(page); await sleep(2500);
    const res = await page.evaluate((s, inn, cs) => cs.map((t) => {
      const el = document.querySelector(s); const c = el.cloneNode(true);
      const tx = inn ? c.querySelector(inn) : c; tx.textContent = t; el.parentElement.appendChild(c);
      const rg = document.createRange(); rg.selectNodeContents(tx);
      const lines = new Set([...rg.getClientRects()].map((r) => Math.round(r.top))).size; c.remove(); return lines;
    }), sel, inner, cands);
    console.log(vw + ':', res.map((n, i) => `${n}L "${cands[i].slice(0, 34)}"`).join(' | '));
    await page.close();
  }
  await b.close();
})();
