// Lengths of the filmGrid films in a page's CMS JSON (no copy): node films-shape.cjs <data-name>
const fs = require('fs'); const path = require('path'); const { SP } = require('./lib.cjs');
const j = JSON.parse(fs.readFileSync(path.join(SP, 'crawl', 'data', process.argv[2] + '.json'), 'utf8')).pageProps.page;
for (const c of j.components || []) {
  if (c._type !== 'filmGrid') continue;
  console.log('filmGrid films:', c.films.length, 'mobileLimit', c.mobileLimit, 'tag', c.tag);
  c.films.forEach((f, i) => console.log(String(i + 1).padStart(2), 'title', (f.title || '').length, 'creator', (f.creator || '').length, 'type', f.type, 'award', (f.award || '').length, 'slugLen', (f.slug && f.slug.current || '').length));
}
