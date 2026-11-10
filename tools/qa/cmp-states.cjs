// Compare animation state (orig vs replica) at identical scroll positions.  usage: node cmp-states.cjs <vw>x<vh>
const fs = require('fs');
const path = require('path');
const { SP } = require('./lib.cjs');
const tag = process.argv[2] || '1440x900';
const O = JSON.parse(fs.readFileSync(path.join(SP, 'shots', `orig-${tag}`, 'states.json'), 'utf8'));
const R = JSON.parse(fs.readFileSync(path.join(SP, 'shots', `replica-${tag}`, 'states.json'), 'utf8'));
console.log('scrollHeight orig', O.H, 'replica', R.H);
const n = Math.min(O.states.length, R.states.length);
const f = (v) => (v == null ? '-' : typeof v === 'number' ? v.toFixed(2) : JSON.stringify(v));
let worst = {};
const track = (k, d) => { worst[k] = Math.max(worst[k] || 0, Math.abs(d)); };
for (let i = 0; i < n; i++) {
  const a = O.states[i], b = R.states[i];
  const lines = [];
  lines.push(`--- y=${a.y} (replica y=${b.y})`);
  // nav
  const nt = (s) => (s.nav && s.nav.ty != null ? s.nav.ty : 0);
  lines.push(`nav ty  orig ${f(nt(a))}  replica ${f(nt(b))}`);
  track('nav', nt(a) - nt(b));
  // hero images: scale + opacity
  const hs = (s) => s.hero.map((h) => `${h.m && h.m.s != null ? h.m.s.toFixed(2) : 'n'}/${h.o}`).join(' ');
  lines.push(`hero s/o orig: ${hs(a)}`);
  lines.push(`hero s/o repl: ${hs(b)}`);
  a.hero.forEach((h, k) => {
    const hb = b.hero[k];
    if (!hb) return;
    track('heroOpacity', h.o - hb.o);
    if (h.r && hb.r) for (let q = 0; q < 4; q++) track('heroRect', h.r[q] - hb.r[q]);
    if (h.m && hb.m && typeof h.m === 'object' && typeof hb.m === 'object') { track('heroScale', (h.m.s || 0) - (hb.m.s || 0)); track('heroTz', (h.m.tz || 0) - (hb.m.tz || 0)); }
  });
  // scroll text lines: compare progress distribution (counts differ: compare mean)
  const mean = (arr) => (arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : 0);
  lines.push(`scrollText mean%  orig ${mean(a.st).toFixed(1)} (${a.st.length} lines)  replica ${mean(b.st).toFixed(1)} (${b.st.length} lines)`);
  track('stMean', mean(a.st) - mean(b.st));
  // founders
  const st = (s) => s.sticky && s.sticky.r ? `${s.sticky.r[2]}x${s.sticky.r[3]} blur:${s.sticky.f}` : '-';
  lines.push(`sticky orig ${st(a)} | replica ${st(b)}`);
  if (a.sticky.r && b.sticky.r) { track('stickyW', a.sticky.r[2] - b.sticky.r[2]); track('stickyH', a.sticky.r[3] - b.sticky.r[3]); }
  lines.push(`overlay orig ${a.overlay} | replica ${b.overlay}`);
  lines.push(`bgOpacity orig ${f(a.stickyPics)} | replica ${f(b.stickyPics)}`);
  lines.push(`smallPics orig ${JSON.stringify(a.smallPics.map((m) => m && m.ty))} | replica ${JSON.stringify(b.smallPics.map((m) => m && m.ty))}`);
  lines.push(`imagesBox ty orig ${a.imagesBoxM && a.imagesBoxM.ty} | replica ${b.imagesBoxM && b.imagesBoxM.ty}`);
  if (process.argv[3] === 'v' || i % 1 === 0) console.log(lines.join('\n'));
}
console.log('\nWORST ABS DELTAS', JSON.stringify(Object.fromEntries(Object.entries(worst).map(([k, v]) => [k, +v.toFixed(3)]))));
