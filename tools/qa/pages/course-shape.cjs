// Compact structural summary of a page's CMS JSON (counts + string lengths, no copy):  node course-shape.cjs <slug-file-without-.json> [maxDepth=3]
const fs = require('fs');
const path = require('path');
const { SP } = require('./lib.cjs');
const name = process.argv[2];
const j = JSON.parse(fs.readFileSync(path.join(SP, 'crawl', 'data', name + '.json'), 'utf8')).pageProps.page;
const plain = (b) => { let t = ''; (function w(x) { if (Array.isArray(x)) x.forEach(w); else if (x && typeof x === 'object') { if (typeof x.text === 'string') t += x.text; Object.values(x).forEach((v) => typeof v === 'object' && w(v)); } })(b); return t.length; };
const sh = (v, d) => {
  if (Array.isArray(v)) {
    if (v.length && v[0] && v[0]._type === 'block') return `rich(${plain(v)})`;
    return `[${v.length}] ` + (v.length ? sh(v[0], d + 1) : '');
  }
  if (v && typeof v === 'object') {
    if (v._type === 'image' || v.asset) return 'img';
    if (d > 3) return '{…}';
    return '{' + Object.entries(v).filter(([k]) => !/^_(key|type|id|rev|createdAt|updatedAt)$/.test(k) && !/^seo/.test(k)).map(([k, x]) => `${k}:${sh(x, d + 1)}`).join(' ') + '}';
  }
  if (typeof v === 'string') return v.length > 40 ? `"${v.length}c"` : JSON.stringify(v);
  return String(v);
};
for (const c of j.components || []) console.log(`${c._type}${c.type ? ':' + c.type : ''}  ->  ` + sh(Object.fromEntries(Object.entries(c).filter(([k]) => !/^_(key|type)$/.test(k) && k !== 'type')), 0).slice(0, 760));
console.log('--- doc fields:', Object.keys(j).filter((k) => !['components'].includes(k) && !k.startsWith('_') && !k.startsWith('seo')).map((k) => `${k}:${sh(j[k], 2).slice(0, 60)}`).join(' | ').slice(0, 900));
