// Compare original vs replica fingerprints.   node fpdiff.cjs <name> [vw=1440] [maxLines=14]
const fs = require('fs');
const path = require('path');
const { OUT } = require('./fp.cjs');
const name = process.argv[2];
const vw = process.argv[3] || '1440';
const MAXL = +(process.argv[4] || 14);
const load = (w) => JSON.parse(fs.readFileSync(path.join(OUT, `${w}-${name}-${vw}.json`), 'utf8'));
const A = load('orig'), B = load('rep');
const key = (i) => (i.k === 't' ? `t${Math.round(i.fs)}/${Math.round(i.lh)}` : i.k === 'm' ? `m${i.tag}` : 'b');
const ka = A.items.map(key), kb = B.items.map(key);
// LCS alignment
const n = ka.length, m = kb.length;
const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = ka[i] === kb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
const pairs = [], onlyA = [], onlyB = [];
let i = 0, j = 0;
while (i < n && j < m) {
  if (ka[i] === kb[j]) { pairs.push([A.items[i], B.items[j]]); i++; j++; }
  else if (dp[i + 1][j] >= dp[i][j + 1]) onlyA.push(A.items[i++]); else onlyB.push(B.items[j++]);
}
while (i < n) onlyA.push(A.items[i++]);
while (j < m) onlyB.push(B.items[j++]);
const f = (v) => (v >= 0 ? '+' : '') + v.toFixed(1);
console.log(`== ${name} @${vw}   height orig ${A.height} | rep ${B.height}  (${f(B.height - A.height)})`);
console.log(`items orig ${n} | rep ${m} | aligned ${pairs.length} | only-orig ${onlyA.length} | only-rep ${onlyB.length}`);
const tol = 2.5;
const bad = pairs.filter(([a, b]) => Math.abs(b.y - a.y) > tol || Math.abs(b.h - a.h) > tol || Math.abs(b.w - a.w) > tol || Math.abs(b.x - a.x) > tol);
const dyAll = pairs.map(([a, b]) => Math.abs(b.y - a.y));
console.log(`aligned within ±${tol}px on x,y,w,h: ${pairs.length - bad.length}/${pairs.length}   mean|dy| ${(dyAll.reduce((s, v) => s + v, 0) / Math.max(1, dyAll.length)).toFixed(2)}`);
console.log('-- sections (orig → rep): y/h');
const sa = A.sections, sb = B.sections;
for (let s = 0; s < Math.max(sa.length, sb.length); s++) {
  const a = sa[s], b = sb[s];
  console.log(`  ${String(s).padStart(2)} ${(a ? a.tag + '.' + a.cls : '—').slice(0, 34).padEnd(34)} ${a ? `${a.y}/${a.h}` : '—'}   |   ${(b ? b.tag + '.' + b.cls : '—').slice(0, 30).padEnd(30)} ${b ? `${b.y}/${b.h}` : '—'}${a && b ? `   Δh ${f(b.h - a.h)}` : ''}`);
}
console.log(`-- first ${MAXL} out-of-tolerance aligned pairs (document order)`);
for (const [a, b] of bad.slice(0, MAXL)) console.log(`  ${a.k}${a.tag} "${a.cls.slice(0, 26)}" ~ "${b.cls.slice(0, 22)}"  y ${a.y}→${b.y} (${f(b.y - a.y)})  h ${a.h}→${b.h} (${f(b.h - a.h)})  w ${a.w}→${b.w} (${f(b.w - a.w)})  x ${f(b.x - a.x)}  chars ${a.chars}|${b.chars}`);
if (onlyA.length) { console.log('-- only in orig (first 8)'); for (const a of onlyA.slice(0, 8)) console.log(`  ${a.k}${a.tag} "${a.cls.slice(0, 40)}" y${a.y} ${a.w}x${a.h} fs${a.fs} chars${a.chars}`); }
if (onlyB.length) { console.log('-- only in rep (first 8)'); for (const b of onlyB.slice(0, 8)) console.log(`  ${b.k}${b.tag} "${b.cls.slice(0, 40)}" y${b.y} ${b.w}x${b.h} fs${b.fs} chars${b.chars}`); }
