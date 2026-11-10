// Add stand-in photos to the replica's manifest from the scraped candidates:  node addphotos.cjs slot=query:index:WxH [...]   then run tools/fetch-photos.cjs
const fs = require('fs'); const path = require('path'); const { SP } = require('./lib.cjs');
const cand = JSON.parse(fs.readFileSync(path.join(SP, 'stock', 'candidates.json'), 'utf8'));
const MAN = path.resolve(__dirname, '..', '..', 'photos.manifest.json');
const man = JSON.parse(fs.readFileSync(MAN, 'utf8'));
for (const spec of process.argv.slice(2)) {
  const [slot, rest] = spec.split('=');
  const [q, idx, dim, crop] = rest.split(':');
  const it = (cand[q] || [])[+idx];
  if (!it) { console.log('MISSING', spec); continue; }
  const [w, h] = dim.split('x').map(Number);
  const entry = { slot, id: it.id, alt: it.alt.replace(/^./, (c) => c.toUpperCase()), source: 'https://unsplash.com' + it.page, variants: [{ w, h, file: slot + '.jpg', ...(crop ? { crop } : {}) }] };
  const k = man.items.findIndex((x) => x.slot === slot);
  if (k >= 0) man.items[k] = entry; else man.items.push(entry);
  console.log('ok', slot, it.id.slice(0, 22), it.alt.slice(0, 60));
}
fs.writeFileSync(MAN, JSON.stringify(man, null, 1) + '\n');
console.log('manifest items:', man.items.length);
