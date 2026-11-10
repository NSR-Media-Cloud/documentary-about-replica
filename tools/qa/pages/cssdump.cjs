// Prints the compiled CSS rules of one or more CSS-module prefixes from the original, hashes stripped.
//   node cssdump.cjs stats pricingCards [--all-media]
const fs = require('fs');
const path = require('path');
const { SP } = require('./lib.cjs');
const dir = path.join(SP, 'crawl', 'css');
const mods = process.argv.slice(2).filter((a) => !a.startsWith('--'));

function parse(src, media, out) {
  let i = 0;
  while (i < src.length) {
    const open = src.indexOf('{', i);
    if (open < 0) break;
    const prelude = src.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (j < src.length && depth > 0) { const c = src[j]; if (c === '{') depth++; else if (c === '}') depth--; j++; }
    const body = src.slice(open + 1, j - 1);
    if (/^@(media|supports|layer)/.test(prelude)) parse(body, (media ? media + ' ' : '') + prelude.replace(/^@media\s*/, '@'), out);
    else if (/^@keyframes/.test(prelude)) out.push({ media, sel: prelude, body: body.replace(/\s+/g, ' ').trim(), kf: true });
    else if (!prelude.startsWith('@')) out.push({ media, sel: prelude, body: body.replace(/\s+/g, ' ').trim() });
    i = j;
  }
}
const rules = [];
for (const f of fs.readdirSync(dir)) parse(fs.readFileSync(path.join(dir, f), 'utf8'), '', rules);
const strip = (s) => s.replace(/\.([A-Za-z0-9]+)_([A-Za-z0-9]+)__[A-Za-z0-9_-]+/g, '.$1_$2').replace(/([A-Za-z0-9]+)_([A-Za-z0-9]+)__[A-Za-z0-9_-]{4,6}(?=[,\s{)]|$)/g, '$1_$2');
const seen = new Set();
for (const m of mods) {
  console.log(`\n/* ===== ${m} ===== */`);
  for (const r of rules) {
    const hit = r.kf ? r.sel.includes(m + '_') : r.sel.includes('.' + m + '_');
    if (!hit) continue;
    const line = `${r.media ? r.media + ' ' : ''}${strip(r.sel)}{${r.body.replace(/\s*;\s*/g, ';').replace(/;$/, '')}}`;
    if (seen.has(line)) continue;
    seen.add(line);
    console.log(line);
  }
}
