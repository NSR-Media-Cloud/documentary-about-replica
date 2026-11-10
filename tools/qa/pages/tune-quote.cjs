// Try candidate quote texts on the REAL built page (line splitter included) and print the quote section height at both widths.
//   node tune-quote.cjs <slug> <fp-name> "<cand 1>" "<cand 2>" ...        (restores the original text afterwards)
const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
const { launch, openPage, waitReady, sleep, SP } = require('./lib.cjs');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const [slug, fpName, ...cands] = process.argv.slice(2);
const FILE = path.join(ROOT, 'src/data/course-pages.cjs');
const target = (vw) => { const j = JSON.parse(fs.readFileSync(path.join(SP, 'fp', 'orig-' + fpName + '-' + vw + '.json'), 'utf8')); const s = j.sections.find((x) => /scrollText/.test(x.cls)); return Math.round(s.h * 10) / 10; };
(async () => {
  const orig = fs.readFileSync(FILE, 'utf8');
  let k = orig.indexOf("'" + slug + "': {"); if (k < 0) k = orig.indexOf(slug + ': {');
  const qi = orig.indexOf('quote: [', k), q0 = qi + 'quote: '.length, q1 = orig.indexOf(']', q0);
  const arrSrc = orig.slice(q0, q1 + 1);
  const quoted = arrSrc.match(/'[^']*'/g); const author = quoted[quoted.length - 1].slice(1, -1);
  console.log('targets 1440/390:', target(1440), target(390), '| author', author);
  const browser = await launch();
  try {
    for (const c of cands) {
      fs.writeFileSync(FILE, orig.slice(0, q0) + '[' + JSON.stringify(c) + ', ' + JSON.stringify(author) + ']' + orig.slice(q1 + 1));
      execSync('node src/build.cjs courses/' + slug, { cwd: ROOT, stdio: 'pipe' });
      const out = [];
      for (const vw of [1440, 390]) {
        const p = await openPage(browser, { vw, vh: vw <= 480 ? 844 : 900, url: 'http://localhost:4660/courses/' + slug, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
        await waitReady(p); await sleep(1800);
        out.push(await p.evaluate(() => Math.round(document.querySelector('.scroll-text--quote').getBoundingClientRect().height * 10) / 10));
        await p.close();
      }
      console.log(out[0] === target(1440) && out[1] === target(390) ? 'MATCH' : '     ', out.join(' / '), '|', c.slice(0, 80));
    }
  } finally { fs.writeFileSync(FILE, orig); execSync('node src/build.cjs courses/' + slug, { cwd: ROOT, stdio: 'pipe' }); await browser.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
