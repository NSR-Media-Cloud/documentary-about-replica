'use strict';
// Static page builder:   node src/build.cjs [path-prefix]
// Reads src/pages/*.cjs (page = { path, title, description, active, blocks:[{block, ...props}] }),
// renders each block through src/blocks, wraps it in the shell and writes <path>/index.html.
const fs = require('fs');
const path = require('path');
const { layout } = require('./shell.cjs');
const registry = require('./blocks/index.cjs');

const ROOT = path.resolve(__dirname, '..');
// optional path prefix, given WITHOUT a leading slash (Git Bash rewrites "/about" into a Windows path):  node src/build.cjs about
const only = process.argv[2] ? '/' + process.argv[2].replace(/^\/+/, '') : '';
const dir = path.join(__dirname, 'pages');
const pages = fs.readdirSync(dir).filter((f) => f.endsWith('.cjs')).sort()
  .flatMap((f) => { const m = require(path.join(dir, f)); return Array.isArray(m) ? m : [m]; });

let count = 0;
for (const page of pages) {
  if (only && !page.path.startsWith(only)) continue;
  const css = new Set();
  const body = page.blocks.map((b) => {
    const def = registry[b.block];
    if (!def) throw new Error(`Unknown block "${b.block}" on ${page.path}`);
    (def.css || []).forEach((c) => css.add(c));
    return def.render(b, page, registry);
  }).join('\n\n');
  const html = layout(page, body, [...css]);
  const out = page.path === '/' ? 'index.html' : page.path === '/404' ? '404.html' : path.join(page.path.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(path.join(ROOT, out)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, out), html);
  count++;
  console.log(`built ${page.path.padEnd(44)} → ${out}  (${(html.length / 1024).toFixed(1)} KB)`);
}
console.log(`${count} page(s) written`);
