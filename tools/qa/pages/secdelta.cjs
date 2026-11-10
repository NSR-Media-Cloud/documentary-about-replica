// Sections whose height differs between original and replica:  node secdelta.cjs <name> <vw>
const fs = require('fs'); const path = require('path'); const { SP } = require('./lib.cjs');
const [name, vw] = process.argv.slice(2);
const L = (w) => JSON.parse(fs.readFileSync(path.join(SP, 'fp', `${w}-${name}-${vw}.json`), 'utf8'));
const O = L('orig'), R = L('rep');
const o = O.sections.filter((s, i, a) => !(s.tag === 'footer' && a[i - 1] && a[i - 1].tag === 'footer')), r = R.sections.filter((s) => !/spacer/.test(s.cls));
const oo = o.filter((s) => !/spacer/.test(s.cls));
console.log(name, vw, 'orig', O.height, 'rep', R.height);
for (let i = 0; i < Math.min(oo.length, r.length); i++) { const d = Math.round((r[i].h - oo[i].h) * 10) / 10; console.log(String(i).padStart(2), (oo[i].tag + '.' + oo[i].cls).slice(0, 38).padEnd(38), 'orig', String(Math.round(oo[i].h * 10) / 10).padStart(8), 'rep', String(Math.round(r[i].h * 10) / 10).padStart(8), Math.abs(d) > 0.6 ? 'Δ ' + d : ''); }
