// Zero-dependency static server for the replica.   node server.cjs [port]   (default 4660)
// Behaves like the source site's hosting: clean URLs (/about → about/index.html), a 404 page,
// "/about/" → 308 "/about", and /early-course-registration → 307 "/".
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = __dirname;
const PORT = +(process.argv[2] || process.env.PORT || 4660);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.mp4': 'video/mp4', '.webm': 'video/webm', '.xml': 'application/xml',
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt', '.md', '.xml']);
const REDIRECTS = { '/early-course-registration': '/' };
const BLOCKED = /[\\/](node_modules|tools|src|\.git)[\\/]/;

function serve(req, res, file, st, status) {
  const ext = path.extname(file).toLowerCase();
  const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' };
  const range = req.headers.range && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
  if (range && (ext === '.mp4' || ext === '.webm')) {            // video seeking
    const start = range[1] ? +range[1] : 0;
    const end = range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1;
    res.writeHead(206, { ...headers, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Content-Length': end - start + 1 });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  const enc = String(req.headers['accept-encoding'] || '');
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(enc)) {
    headers['Content-Encoding'] = 'gzip';
    headers.Vary = 'Accept-Encoding';
    res.writeHead(status, headers);
    fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res);
  } else {
    headers['Content-Length'] = st.size;
    if (ext === '.mp4' || ext === '.webm') headers['Accept-Ranges'] = 'bytes';
    res.writeHead(status, headers);
    fs.createReadStream(file).pipe(res);
  }
}

function notFound(req, res, wantsHtml) {
  const file = path.join(ROOT, '404.html');
  fs.stat(file, (err, st) => {
    if (wantsHtml && !err && st.isFile()) return serve(req, res, file, st, 404);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  let p;
  try { p = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  const bare = p.length > 1 ? p.replace(/\/+$/, '') : p;
  if (REDIRECTS[bare]) { res.writeHead(307, { Location: REDIRECTS[bare] }); return res.end(); }
  if (p.length > 1 && p.endsWith('/')) { res.writeHead(308, { Location: bare + url.search }); return res.end(); }

  const hasExt = path.extname(bare) !== '';
  const candidates = bare === '/' ? ['/index.html'] : hasExt ? [bare] : [bare + '/index.html', bare + '.html'];
  const attempt = (i) => {
    if (i >= candidates.length) return notFound(req, res, !hasExt);
    const file = path.normalize(path.join(ROOT, candidates[i]));
    if (!file.startsWith(ROOT) || BLOCKED.test(file)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.stat(file, (err, st) => (err || !st.isFile() ? attempt(i + 1) : serve(req, res, file, st, 200)));
  };
  attempt(0);
}).listen(PORT, () => console.log(`Replica running at http://localhost:${PORT}/`));
