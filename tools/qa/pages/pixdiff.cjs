// Pixel difference between two PNGs of the same size:  node pixdiff.cjs a.png b.png [diff-out.png]
const { launch, fs, path } = require('./lib.cjs');
const [a, b, out] = process.argv.slice(2);
(async () => {
  const br = await launch(); const p = await br.newPage();
  const A = fs.readFileSync(a).toString('base64'), B = fs.readFileSync(b).toString('base64');
  const r = await p.evaluate(async (A, B) => {
    const load = (s) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = 'data:image/png;base64,' + s; });
    const [ia, ib] = await Promise.all([load(A), load(B)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return { error: `size ${ia.width}x${ia.height} vs ${ib.width}x${ib.height}` };
    const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height; const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, c.width, c.height).data;
    x.clearRect(0, 0, c.width, c.height); x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, c.width, c.height).data;
    const o = x.createImageData(c.width, c.height); let max = 0, sum = 0, over = 0, n = c.width * c.height;
    for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])); sum += d; if (d > max) max = d; if (d > 24) over++; o.data[i] = Math.min(255, d * 6); o.data[i + 1] = Math.min(255, d * 6); o.data[i + 2] = Math.min(255, d * 6); o.data[i + 3] = 255; }
    x.putImageData(o, 0, 0);
    return { w: c.width, h: c.height, max, mean: +(sum / n).toFixed(3), pctOver24: +(100 * over / n).toFixed(3), diff: c.toDataURL('image/png').split(',')[1] };
  }, A, B);
  if (r.diff && out) fs.writeFileSync(out, Buffer.from(r.diff, 'base64'));
  delete r.diff; console.log(path.basename(a), 'vs', path.basename(b), JSON.stringify(r));
  await br.close();
})();
