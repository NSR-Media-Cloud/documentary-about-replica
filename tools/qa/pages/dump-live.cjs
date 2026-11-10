// Compact DOM tree of an element on the LIVE original page (after optional click script).
//   node dump-live.cjs <route-no-slash> "<root selector>" [depth=8] [textLen=30] ["<js to run first>"] [nth=0] [vw=1440]
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
const route = '/' + (process.argv[2] || '').replace(/^.*Program Files\/Git\//, '').replace(/^\/+/, '');
const [root, depthS = '8', tlS = '30', pre = '', nthS = '0', vwS = '1440'] = process.argv.slice(3);
(async () => {
  const browser = await launch();
  const vw = +vwS;
  const page = await openPage(browser, { vw, vh: vw <= 480 ? 844 : 900, url: 'https://theartofdocumentary.com' + route, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
  await waitReady(page); await sleep(3000);
  if (pre) { await page.evaluate(pre); await sleep(2500); }
  const txt = await page.evaluate((sel, depth, tl, nth) => {
    const el = document.querySelectorAll(sel)[nth];
    if (!el) return 'NOT FOUND: ' + sel;
    const out = [];
    const simp = (c) => String(typeof c === 'string' ? c : (c && c.baseVal) || '').split(/\s+/).filter(Boolean).map((x) => x.replace(/^([A-Za-z0-9]+)_([A-Za-z0-9]+)__[A-Za-z0-9_-]+$/, '$1.$2')).join(' ');
    const walk = (e, d) => {
      if (d > depth) return;
      const keep = ['href', 'src', 'type', 'role', 'aria-label', 'data-', 'style', 'id', 'width', 'height'];
      const attrs = [...e.attributes].filter((a) => a.name !== 'class' && keep.some((k) => a.name.startsWith(k))).map((a) => a.name + '=' + JSON.stringify(a.value.length > 48 ? a.value.slice(0, 48) + '…' : a.value)).join(' ');
      out.push('  '.repeat(d) + '<' + e.tagName.toLowerCase() + (simp(e.className) ? ' .' + simp(e.className) : '') + (attrs ? ' ' + attrs : '') + '>');
      for (const n of e.childNodes) {
        if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) out.push('  '.repeat(d + 1) + '"' + t.slice(0, tl) + (t.length > tl ? '…' : '') + '" (' + t.length + ')'); }
        else if (n.nodeType === 1 && !['SCRIPT', 'STYLE'].includes(n.tagName)) walk(n, d + 1);
      }
    };
    walk(el, 0);
    return out.join('\n');
  }, root, +depthS, +tlS, +nthS);
  console.log(txt);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
