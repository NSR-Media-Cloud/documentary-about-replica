'use strict';
// Made-up award laurels. Each is one of the generated wreaths in assets/svg/badges with the academy wordmark (category winners)
// or a fictional festival name (festival laurels) set inside. No real festival, award or contest mark is reproduced.
// The nine wreaths are packed into one sprite (assets/svg/badges/laurels.svg, regenerated on every build) so each page
// carries a short <use> reference instead of a copy of the wreath.
const fs = require('fs');
const path = require('path');

const ASSETS = path.join(__dirname, '..', '..', 'assets', 'svg');
const logo = JSON.parse(fs.readFileSync(path.join(ASSETS, 'logo.json'), 'utf8'));
const SPRITE = '/assets/svg/badges/laurels.svg';

(function writeSprite() {
  const symbols = [];
  for (let n = 1; n <= 9; n++) {
    const inner = fs.readFileSync(path.join(ASSETS, 'badges', `laurel-${n}.svg`), 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
      .replace(/<path[^>]*\/>/g, '');   // the generated laurels carry their own outlined lettering: keep the wreath only
    symbols.push(`<symbol id="laurel-${n}" viewBox="0 0 376 240">${inner}</symbol>`);
  }
  const out = `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>\n`;
  const file = path.join(ASSETS, 'badges', 'laurels.svg');
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== out) fs.writeFileSync(file, out);
}());

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CONTEST = '24 HOUR DOC';
const open = (vb, label) => `<svg class="badge" viewBox="${vb}" role="img" aria-label="${esc(label)}" fill="#fff" xmlns="http://www.w3.org/2000/svg">`;
const wreath = (n, sx = 1) => `<use href="${SPRITE}#laurel-${n}" width="376" height="240"${sx === 1 ? '' : ` transform="translate(188 0) scale(${sx} 1) translate(-188 0)"`}/>`;

// All nine wreaths share one outline (x 87–289, y 31–223, centre 188,127); the viewBoxes crop to it at the two aspect ratios the page uses.
const VIEW = { std: '33.9 25.3 308.3 203.6', wide: '-16.9 25.3 409.7 203.6' };
const STRETCH = { std: 1.4, wide: 1.85 };
/** lettering is enlarged about the wreath's centre so it fills the widened opening */
const grow = (inner, k, dy = 0) => `<g transform="translate(188 ${118 + dy}) scale(${k}) translate(-188 -118)">${inner}</g>`;

/** Category-winner laurel: category · WINNER · wordmark · contest · year.  `wide` is the 2:1 crop used on the categories grid. */
function winner({ label, wreath: n = 1, year = '2027', wide = false }) {
  const k = 0.9, w = logo.w * k;
  return `${open(wide ? VIEW.wide : VIEW.std, `${label} winner, ${CONTEST} ${year}`)}${wreath(n, wide ? STRETCH.wide : STRETCH.std)}`
    + grow(`<text class="badge__label" x="188" y="74" text-anchor="middle">${esc(label.toUpperCase())}</text>`
      + `<text class="badge__label badge__label--s" x="188" y="84" text-anchor="middle">WINNER</text>`
      + `<path transform="translate(${(188 - w / 2).toFixed(2)} 94) scale(${k})" d="${logo.d}"/>`
      + `<text class="badge__name" x="188" y="133" text-anchor="middle">${CONTEST}</text>`
      + `<text class="badge__year" x="188" y="146" text-anchor="middle">${year}</text>`, wide ? 1.4 : 1.2, wide ? 12 : 6) + '</svg>';
}

/** Festival laurel: kicker · festival name (1–3 lines) · year. `style` varies the lettering so the five do not look alike. */
function festival({ kicker, lines, year, wreath: n = 1, style = 'caps' }) {
  const lh = style === 'serif' ? 17 : 15;
  const y0 = 120 - ((lines.length - 1) * lh) / 2;
  return `${open(VIEW.std, `${kicker}: ${lines.join(' ')} ${year}`)}${wreath(n, STRETCH.std)}`
    + grow(`<text class="badge__kicker" x="188" y="${(y0 - 17).toFixed(1)}" text-anchor="middle">${esc(kicker)}</text>`
    + lines.map((l, i) => `<text class="badge__fest badge__fest--${style}" x="188" y="${(y0 + i * lh).toFixed(1)}" text-anchor="middle">${esc(l)}</text>`).join('')
    + `<text class="badge__year" x="188" y="${(y0 + (lines.length - 1) * lh + 18).toFixed(1)}" text-anchor="middle">${year}</text>`, 1.4, 4) + '</svg>';
}

module.exports = { winner, festival, CONTEST };
