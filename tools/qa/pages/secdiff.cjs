// Side-by-side item positions (relative to their section) for one section pair.
//   node secdiff.cjs <name> <vw> <origSectionIdx> <repSectionIdx> [maxRows=40] [minChars=0]
const fs = require('fs');
const path = require('path');
const { OUT } = require('./fp.cjs');
const [name, vw, oi, ri, maxS = '40', minS = '0'] = process.argv.slice(2);
const load = (w) => JSON.parse(fs.readFileSync(path.join(OUT, `${w}-${name}-${vw}.json`), 'utf8'));
const A = load('orig'), B = load('rep');
const rows = (D, idx) => {
  const s = D.sections[+idx];
  return D.items.filter((i) => i.y >= s.y - 1 && i.y < s.y + s.h && (i.k === 'm' || i.chars >= +minS) && !(i.k === 'b' && !i.bg) && i.w > 4)
    .map((i) => ({ rel: +(i.y - s.y).toFixed(1), h: i.h, w: i.w, x: i.x, fs: i.fs, ch: i.chars, tag: i.tag, k: i.k }));
};
const a = rows(A, oi), b = rows(B, ri);
console.log(`orig section ${oi}: ${A.sections[+oi].y}/${A.sections[+oi].h}   rep section ${ri}: ${B.sections[+ri].y}/${B.sections[+ri].h}   (${a.length} vs ${b.length} items)`);
const f = (r) => r ? `${(r.k + r.tag).padEnd(9)} y${String(r.rel).padStart(7)} x${String(Math.round(r.x)).padStart(5)} ${String(Math.round(r.w)).padStart(5)}x${String(Math.round(r.h)).padEnd(5)} fs${String(Math.round(r.fs)).padEnd(3)} ch${r.ch}` : '';
for (let k = 0; k < Math.min(Math.max(a.length, b.length), +maxS); k++) console.log(f(a[k]).padEnd(58) + '| ' + f(b[k]));
