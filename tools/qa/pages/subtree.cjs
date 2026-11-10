// DOM subtree of the first element carrying a CSS-module class "<Module>.x" in a saved page.
//   node subtree.cjs <html-file> <Module> [maxDepth=14] [textLen=18] [nth=1]
const { spawnSync } = require('child_process');
const path = require('path');
const [file, mod, md = '14', tl = '18', nth = '1'] = process.argv.slice(2);
const r = spawnSync('node', [path.join(__dirname, 'tree.cjs'), file, '60', tl], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const lines = r.stdout.split('\n');
const indent = (l) => l.match(/^ */)[0].length;
const isRoot = (l) => /^\s*</.test(l) && new RegExp('[ .]' + mod + '\\.[A-Za-z0-9_-]+').test(l.split('>')[0]);
let count = 0, start = -1;
for (let i = 0; i < lines.length; i++) if (isRoot(lines[i]) && ++count === +nth) { start = i; break; }
if (start < 0) { console.log('module not found in', file); process.exit(1); }
const base = indent(lines[start]);
const out = [];
for (let i = start; i < lines.length; i++) {
  if (i > start && indent(lines[i]) <= base) break;
  if ((indent(lines[i]) - base) / 2 <= +md) out.push(lines[i].slice(base));
}
console.log(out.join('\n'));
