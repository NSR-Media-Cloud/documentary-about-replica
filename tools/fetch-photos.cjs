// Fetches the stand-in photography (Unsplash licence) listed in photos.manifest.json into assets/img/.
// Re-run any time:  node tools/fetch-photos.cjs     (needs internet; skips files that already exist)
// Swap in your own pictures by replacing the files in assets/img/ with the same names.
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'img');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'photos.manifest.json'), 'utf8'));
fs.mkdirSync(OUT, { recursive: true });

const get = (url, file) =>
  new Promise((resolve) => {
    if (fs.existsSync(file) && fs.statSync(file).size > 4000) return resolve('exists');
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return get(res.headers.location, file).then(resolve);
      }
      if (res.statusCode !== 200) { res.resume(); return resolve('HTTP ' + res.statusCode); }
      const ws = fs.createWriteStream(file);
      res.pipe(ws);
      ws.on('finish', () => resolve('ok'));
    });
    req.on('error', (e) => resolve('ERR ' + e.message));
  });

(async () => {
  for (const item of manifest.items) {
    for (const v of item.variants) {
      const url = `https://images.unsplash.com/${item.id}?w=${v.w}&h=${v.h}&fit=crop&crop=${v.crop || 'entropy'}&q=${v.q || 78}&fm=jpg&auto=format`;
      const file = path.join(OUT, v.file);
      const r = await get(url, file);
      console.log(r.padEnd(8), v.file);
    }
  }
})();
