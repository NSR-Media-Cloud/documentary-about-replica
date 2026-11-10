// Contact sheet: tile PNGs of a directory into one labelled image.
// usage: node sheet.cjs <dir> <out.png> <cols> <thumbW> [filterRegex]
const { launch, fs, path } = require('./lib.cjs');
const [, , DIR0, OUT0, COLS = '4', THUMB = '480', FILT = '^s\\d+'] = process.argv;
const DIR = path.resolve(DIR0), OUT = path.resolve(OUT0);
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png') && new RegExp(FILT).test(f)).sort();
const cols = +COLS, tw = +THUMB;
const html = `<!doctype html><meta charset=utf-8><body style="margin:0;background:#222;font:12px monospace;color:#bbb">
<div style="display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:6px;padding:6px">${files
    .map((f) => `<figure style="margin:0"><img src="file:///${path.join(DIR, f).replace(/\\/g, '/')}" style="width:${tw}px;display:block;outline:1px solid #444"><figcaption style="padding:2px 0">${f.replace('.png', '')}</figcaption></figure>`)
    .join('')}</div>`;
const tmp = path.join(DIR, '_sheet.html');
fs.writeFileSync(tmp, html);
(async () => {
  const b = await launch({ args: ['--allow-file-access-from-files', '--hide-scrollbars'] });
  const p = await b.newPage();
  await p.setViewport({ width: cols * (tw + 6) + 6, height: 800 });
  await p.goto('file:///' + tmp.replace(/\\/g, '/'));
  await new Promise((r) => setTimeout(r, 800));
  await p.screenshot({ path: OUT, fullPage: true });
  await b.close();
  fs.unlinkSync(tmp);
  console.log('sheet', OUT, files.length, 'images');
})();
