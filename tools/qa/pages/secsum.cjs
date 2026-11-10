// One-line-per-section height comparison (matched by block keyword):  node secsum.cjs <name> [vw]
const fs = require('fs');
const path = require('path');
const { OUT } = require('./fp.cjs');
const [name, vw = '1440'] = process.argv.slice(2);
const L = (w) => JSON.parse(fs.readFileSync(path.join(OUT, `${w}-${name}-${vw}.json`), 'utf8'));
const A = L('orig'), B = L('rep');
const KEYS = [['accordion', /accordion/], ['quote', /scrollText|scroll-text/], ['video', /videoSlider|video-slider/], ['stats', /\bstats\b/], ['social', /socialCards|social-cards/], ['pricing', /pricingCards|pricing/], ['stack', /courseCardStack|card-stack/], ['contact', /contactForm|contact-form/], ['textMedia', /textMediaCards|text-media-cards/], ['cta', /ctaClickImages|cta-click/], ['banner', /courseBanner|course-banner/]];
const key = (s) => { const c = s.tag + '.' + s.cls; const k = KEYS.find(([, re]) => re.test(c)); return k ? k[0] : null; };
const take = (D) => D.sections.map((s) => ({ k: key(s), h: s.h })).filter((s) => s.k);
const a = take(A), b = take(B);
const seen = {};
const out = [];
for (const s of a) {
  seen[s.k] = (seen[s.k] || 0) + 1;
  const m = b.filter((x) => x.k === s.k)[seen[s.k] - 1];
  const d = m ? m.h - s.h : NaN;
  out.push(`${s.k} ${s.h.toFixed(0)}/${m ? m.h.toFixed(0) : '—'}${Math.abs(d) > 2 ? ' (' + (d > 0 ? '+' : '') + d.toFixed(0) + ')' : ' ✓'}`);
}
console.log(`${name} @${vw}  page ${A.height}/${B.height} (${B.height - A.height >= 0 ? '+' : ''}${(B.height - A.height).toFixed(0)})  | ` + out.join('  '));
