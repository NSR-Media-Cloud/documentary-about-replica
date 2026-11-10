// Page-height parity table (markdown): original vs replica at 1440 and 390 for every route in routes.cjs
const fs = require('fs'); const path = require('path'); const { SP } = require('./lib.cjs');
const ROUTES = require('./routes.cjs');
const get = (w, n, vw) => { try { return JSON.parse(fs.readFileSync(path.join(SP, 'fp', `${w}-${n}-${vw}.json`), 'utf8')).height; } catch (e) { return null; } };
const rows = [];
for (const [name, op, rp] of ROUTES) {
  const cells = [1440, 390].map((vw) => { const o = get('orig', name, vw), r = get('rep', name, vw); if (o == null || r == null) return ['–', '–', '–']; const d = Math.round(r - o); return [o, r, (d > 0 ? '+' : '') + d]; });
  rows.push(`| \`${rp}\` | ${cells[0].join(' | ')} | ${cells[1].join(' | ')} |`);
}
console.log('| replica route | 1440 orig | 1440 replica | Δ | 390 orig | 390 replica | Δ |\n|---|---:|---:|---:|---:|---:|---:|\n' + rows.join('\n'));
