// Side-by-side sheet: orig | replica for matching scroll positions.
// usage: node pairs.cjs <origDir> <replicaDir> <out.png> <thumbW> <yList comma-separated | all>
const { launch, fs, path } = require('./lib.cjs');
const [, , OD0, RD0, OUT0, TW = '620', YS = 'all'] = process.argv;
const OD = path.resolve(OD0), RD = path.resolve(RD0), OUT = path.resolve(OUT0);
const ymap = (dir) => Object.fromEntries(fs.readdirSync(dir).filter((f) => /^s\d+-y\d+\.png$/.test(f)).map((f) => [+f.match(/-y(\d+)\.png/)[1], f]));
const O = ymap(OD), R = ymap(RD);
let ys = Object.keys(O).map(Number).filter((y) => R[y] !== undefined).sort((a, b) => a - b);
if (YS !== 'all') { const want = YS.split(',').map(Number); ys = ys.filter((y) => want.includes(y)); }
const tw = +TW;
const cell = (dir, f, label) => `<figure style="margin:0"><img src="file:///${path.join(dir, f).replace(/\\/g, '/')}" style="width:${tw}px;display:block;outline:1px solid #444"><figcaption style="font:11px monospace;color:#aaa;padding:2px 0">${label}</figcaption></figure>`;
const html = `<!doctype html><meta charset=utf-8><body style="margin:0;background:#222"><div style="display:grid;grid-template-columns:repeat(2,${tw}px);gap:6px;padding:6px">${ys.map((y) => cell(OD, O[y], `ORIGINAL  y=${y}`) + cell(RD, R[y], `REPLICA   y=${y}`)).join('')}</div>`;
const tmp = path.join(path.dirname(OUT), '_pairs.html');
fs.writeFileSync(tmp, html);
(async () => {
  const b = await launch({ args: ['--allow-file-access-from-files', '--hide-scrollbars'] });
  const p = await b.newPage();
  await p.setViewport({ width: 2 * tw + 18, height: 800 });
  await p.goto('file:///' + tmp.replace(/\\/g, '/'));
  await new Promise((r) => setTimeout(r, 900));
  await p.screenshot({ path: OUT, fullPage: true });
  await b.close();
  fs.unlinkSync(tmp);
  console.log('pairs', ys.length, '->', OUT);
})();
