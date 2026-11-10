// Prints an indented DOM tree (tag, classes, key attrs, truncated text) from an HTML file.
// usage: node tree.cjs file.html [maxDepth] [textLen]
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const maxDepth = +(process.argv[3] || 30);
const textLen = +(process.argv[4] || 14);
const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'path', 'circle', 'rect', 'use', 'line', 'polygon', 'stop']);
const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9:-]*)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+)/g;
let depth = 0, m, out = [];
const stack = [];
function attrsOf(s) {
  const o = {};
  for (const a of s.matchAll(/([^\s=>\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) o[a[1]] = a[2] ?? a[3] ?? a[4] ?? '';
  return o;
}
while ((m = re.exec(html))) {
  if (m[0].startsWith('<!--')) continue;
  if (m[4] !== undefined) {
    const t = m[4].replace(/\s+/g, ' ').trim();
    if (t && depth <= maxDepth) out.push('  '.repeat(depth) + '"' + t.slice(0, textLen) + (t.length > textLen ? '…' : '') + '" (' + t.length + ' chars)');
    continue;
  }
  const closing = m[0].startsWith('</');
  const tag = m[1].toLowerCase();
  if (closing) { depth = Math.max(0, depth - 1); continue; }
  const a = attrsOf(m[2] || '');
  const cls = (a.class || '').split(/\s+/).filter(Boolean).map(c => c.replace(/^([a-zA-Z]+)_([a-zA-Z0-9]+)__[A-Za-z0-9_-]+$/, '$1.$2')).join(' ');
  const keep = ['id', 'href', 'src', 'alt', 'aria-label', 'role', 'type', 'data-', 'style', 'srcset', 'sizes', 'width', 'height', 'loading', 'viewBox', 'd'];
  const at = Object.entries(a).filter(([k]) => k !== 'class' && keep.some(p => k.startsWith(p))).map(([k, v]) => k + '=' + JSON.stringify(v.length > 60 ? v.slice(0, 60) + '…' : v)).join(' ');
  if (depth <= maxDepth) out.push('  '.repeat(depth) + '<' + tag + (cls ? ' .' + cls : '') + (at ? ' ' + at : '') + '>');
  if (!VOID.has(tag) && !m[3]) depth++;
}
console.log(out.join('\n'));
