// Layout fingerprint of ANY page (original or replica): every visible text / media / box element with its rect + type metrics.
//   node fp.cjs <orig|rep> <name|all> [viewport widths comma list, default 1440,390]
// Output: tools/qa/out/pages/fp/<which>-<name>-<vw>.json
const { launch, openPage, waitReady, sleep, fs, path, SP } = require('./lib.cjs');
const ROUTES = require('./routes.cjs');
const OUT = path.join(SP, 'fp');
fs.mkdirSync(OUT, { recursive: true });
const BASES = { orig: 'https://theartofdocumentary.com', rep: 'http://localhost:4660' };

function extract() {
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK', 'HEAD', 'TITLE', 'BR']);
  const out = { height: document.documentElement.scrollHeight, items: [], sections: [] };
  const sx = window.scrollX, sy = window.scrollY;
  const cls = (el) => { const c = typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || ''; return c.split(/\s+/).filter(Boolean).map((x) => x.replace(/^([A-Za-z0-9]+)_([A-Za-z0-9]+)__[A-Za-z0-9_-]+$/, '$1.$2')).join(' '); };
  const fixedMemo = new Map();
  const isFixed = (el) => {
    if (!el || el === document.body || el === document.documentElement) return false;
    if (fixedMemo.has(el)) return fixedMemo.get(el);
    const r = getComputedStyle(el).position === 'fixed' || isFixed(el.parentElement);
    fixedMemo.set(el, r);
    return r;
  };
  for (const el of document.body.querySelectorAll('*')) {
    const tag = el.tagName.toLowerCase();
    if (SKIP.has(el.tagName)) continue;
    if (tag !== 'svg' && el.closest('svg')) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.display === 'contents') continue;
    if (isFixed(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    let chars = 0;
    for (const n of el.childNodes) if (n.nodeType === 3) chars += n.textContent.replace(/\s+/g, ' ').trim().length;
    const media = ['img', 'video', 'canvas', 'svg', 'iframe', 'input', 'textarea', 'select'].includes(tag);
    const bgc = cs.backgroundColor;
    const hasBg = !!bgc && !/rgba\(0, 0, 0, 0\)|transparent/.test(bgc);
    const hasBgImg = cs.backgroundImage && cs.backgroundImage !== 'none';
    const bw = ['Top', 'Bottom', 'Left', 'Right'].reduce((a, s) => a + (parseFloat(cs['border' + s + 'Width']) || 0), 0);
    let k = null;
    if (chars > 0) k = 't'; else if (media) k = 'm'; else if (hasBg || hasBgImg || bw > 0) k = 'b';
    if (!k) continue;
    out.items.push({
      k, tag, cls: cls(el), x: +(r.left + sx).toFixed(1), y: +(r.top + sy).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
      fs: parseFloat(cs.fontSize), lh: cs.lineHeight === 'normal' ? 0 : parseFloat(cs.lineHeight), ls: cs.letterSpacing === 'normal' ? 0 : +parseFloat(cs.letterSpacing).toFixed(2),
      fw: cs.fontWeight, col: cs.color, bg: hasBg ? bgc : '', chars, disp: cs.display, op: +(+cs.opacity).toFixed(2),
    });
  }
  const root = document.querySelector('main') || document.body;
  const kids = [];
  for (const c of root.children) { if (/course-body/.test(c.className)) kids.push(...c.children); else kids.push(c); }   // flatten the course page's body wrapper
  for (const c of [...kids, document.querySelector('footer')].filter(Boolean)) {
    const r = c.getBoundingClientRect();
    out.sections.push({ tag: c.tagName.toLowerCase(), cls: cls(c), y: +(r.top + sy).toFixed(1), h: +r.height.toFixed(1), bg: getComputedStyle(c).backgroundColor });
  }
  return out;
}

async function capture(browser, which, name, vw) {
  const row = ROUTES.find((r) => r[0] === name);
  if (!row) throw new Error('unknown route name ' + name);
  const vh = vw <= 480 ? 844 : 900;
  const url = BASES[which] + (which === 'orig' ? row[1] : row[2]);
  const page = await openPage(browser, { vw, vh, url, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e)));
  await waitReady(page);
  await sleep(1400);
  if (name === 'courses-grid') { await page.evaluate(() => document.querySelectorAll('[class*="courses_toggle"] button, .courses-head__toggle button')[1].click()); await sleep(2000); }
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H + vh; y += Math.round(vh * 0.55)) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(230); }
  await sleep(1300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1300);
  const data = await page.evaluate(extract);
  data.meta = { which, name, vw, vh, url, errors };
  fs.writeFileSync(path.join(OUT, `${which}-${name}-${vw}.json`), JSON.stringify(data));
  await page.close();
  return data;
}

module.exports = { capture, extract, OUT };

if (require.main === module) {
  (async () => {
    const which = process.argv[2];
    const sel = process.argv[3] || 'all';
    const widths = (process.argv[4] || '1440,390').split(',').map(Number);
    const names = sel === 'all' ? ROUTES.map((r) => r[0]) : sel.split(',');
    const browser = await launch();
    for (const n of names) {
      for (const vw of widths) {
        const t0 = Date.now();
        try {
          const d = await capture(browser, which, n, vw);
          console.log(`${which} ${n} @${vw}: height ${d.height}, ${d.items.length} items, ${d.sections.length} sections, ${((Date.now() - t0) / 1000).toFixed(1)}s${d.meta.errors.length ? ' ERR ' + d.meta.errors[0] : ''}`);
        } catch (e) { console.log(`${which} ${n} @${vw}: FAILED ${e.message}`); }
      }
    }
    await browser.close();
  })();
}
