// Downloads the Twemoji country flags used by the phone picker into assets/flags/<iso>.svg
//   node tools/fetch-flags.cjs        (needs internet; Twemoji graphics are CC-BY 4.0, https://github.com/twitter/twemoji)
const https = require('https');
const fs = require('fs');
const path = require('path');
const countries = require('../src/data/countries.cjs');

const OUT = path.join(__dirname, '..', 'assets', 'flags');
fs.mkdirSync(OUT, { recursive: true });
const cp = (c) => (0x1f1e6 + c.charCodeAt(0) - 97).toString(16);

const get = (url) => new Promise((res, rej) => https.get(url, (r) => {
  if (r.statusCode !== 200) { r.resume(); return rej(new Error(`${url} → ${r.statusCode}`)); }
  const chunks = []; r.on('data', (d) => chunks.push(d)); r.on('end', () => res(Buffer.concat(chunks)));
}).on('error', rej));

(async () => {
  let ok = 0;
  const queue = countries.map((c) => c[1]);
  const worker = async () => {
    while (queue.length) {
      const iso = queue.shift();
      const url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${cp(iso[0])}-${cp(iso[1])}.svg`;
      try { fs.writeFileSync(path.join(OUT, `${iso}.svg`), await get(url)); ok++; } catch (e) { console.log('FAILED', iso, e.message); }
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  console.log(`${ok}/${countries.length} flags saved to assets/flags`);
})();
