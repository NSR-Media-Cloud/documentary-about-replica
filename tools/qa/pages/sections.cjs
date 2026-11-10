// List the section boxes of a saved fingerprint:  node sections.cjs <orig|rep> <name> [vw...]
const fs = require('fs'); const path = require('path'); const { SP } = require('./lib.cjs');
const [which, name, ...vws] = process.argv.slice(2);
for (const vw of (vws.length ? vws : ['1440', '390'])) {
  const j = JSON.parse(fs.readFileSync(path.join(SP, 'fp', `${which}-${name}-${vw}.json`), 'utf8'));
  console.log(`== ${which} ${name} @${vw}  height ${j.height}`);
  j.sections.forEach((s, i) => console.log(String(i).padStart(2), (s.tag + '.' + s.cls).slice(0, 56).padEnd(56), 'y', String(Math.round(s.y)).padStart(5), 'h', Math.round(s.h * 10) / 10));
}
