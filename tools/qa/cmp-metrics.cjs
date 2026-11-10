// Side-by-side numeric comparison of orig vs replica metrics.  usage: node cmp-metrics.cjs <vw>
const fs = require('fs');
const path = require('path');
const { SP } = require('./lib.cjs');
const vw = process.argv[2] || '1440';
const dir = path.join(SP, 'shots', 'metrics');
const o = JSON.parse(fs.readFileSync(path.join(dir, `orig-${vw}.json`), 'utf8'));
const r = JSON.parse(fs.readFileSync(path.join(dir, `replica-${vw}.json`), 'utf8'));
const by = (a) => Object.fromEntries(a.map((m) => [m.label, m]));
const O = by(o), R = by(r);
const labels = [...new Set([...o.map((m) => m.label), ...r.map((m) => m.label)])];
const d = (a, b) => (a == null || b == null ? '  ?' : (b - a >= 0 ? '+' : '') + (b - a).toFixed(1));
let bad = 0;
console.log('label'.padEnd(14), 'ORIG x,y,w,h'.padEnd(34), 'REPLICA x,y,w,h'.padEnd(34), 'Δx    Δy    Δw    Δh   fs/lh/ls');
for (const l of labels) {
  const a = O[l], b = R[l];
  if (!a || !b || a.missing || b.missing) { console.log(l.padEnd(14), a ? (a.missing ? 'MISSING' : 'ok') : 'n/a', '|', b ? (b.missing ? 'MISSING' : 'ok') : 'n/a'); continue; }
  const dd = [b.x - a.x, b.y - a.y, b.w - a.w, b.h - a.h];
  const flag = dd.some((v) => Math.abs(v) > 2.5) ? ' <<' : '';
  if (flag) bad++;
  const typo = a.fs === b.fs && a.lh === b.lh ? 'same' : `${a.fs}/${a.lh} vs ${b.fs}/${b.lh}`;
  console.log(l.padEnd(14), `${a.x},${a.y},${a.w},${a.h}`.padEnd(34), `${b.x},${b.y},${b.w},${b.h}`.padEnd(34), dd.map((v) => (v >= 0 ? '+' : '') + v.toFixed(1)).join(' ').padEnd(26), typo + flag);
}
console.log('\nrows outside ±2.5px:', bad);
