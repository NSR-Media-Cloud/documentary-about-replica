'use strict';
// Hero "text + image": centred tag / heading / link, then a full-width photo with scroll parallax.
const { esc, pic } = require('../util.cjs');

exports['hero:textImage'] = {
  css: ['textimage'],
  render: (p) => `  <header class="text-image">
    <div class="text-image__inner">
      <h1 class="t-mono orange" data-split>${esc(p.tag)}</h1>
      <h2 class="text-image__title">
        <span class="text-image__heading t-l" data-split>${esc(p.heading)}</span>
${p.link ? `        <span class="text-image__link-wrap t-l"><a class="link moveUp" style="--delay:.5s" href="${p.link.href}">${esc(p.link.label)}</a></span>
` : ''}
      </h2>
      <div class="text-image__scroll t-mono-s"><div class="moveUpF" style="--delay:.7s">Scroll to explore</div></div>
    </div>
    <div class="mediaParallax">
      ${pic({ src: p.image.src, w: p.image.w, h: p.image.h, lazy: false, priority: true, cls: 'text-image__image', sm: p.image.sm })}
    </div>
  </header>`,
};
