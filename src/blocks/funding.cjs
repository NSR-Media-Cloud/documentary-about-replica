'use strict';
// Funding page blocks: ctaBlocks (three "apply" columns) and filmGrid (member work, hover-to-preview).
const { esc, arrow, pic } = require('../util.cjs');

const pad = (n) => String(n).padStart(2, '0');

exports.ctaBlocks = {
  css: ['funding'],
  render: (p) => `  <section class="cta-blocks padding">
    <header><h2 class="t-p">${esc(p.heading)}</h2></header>
    <div class="cta-blocks__blocks">
${p.blocks.map((b) => `      <a class="cta-blocks__block" href="${b.href}">
        <div class="t-mono-s">[ ${esc(b.index)} ]</div>
        <h3 class="t-ms">${esc(b.title)}</h3>
        <p class="t-sp">${esc(b.body)}</p>
        <div class="btn btn--border cta-blocks__button"><span class="t-mono-s">${esc(b.label)}</span>${arrow()}</div>
      </a>`).join('\n')}
    </div>
  </section>`,
};

exports.filmGrid = {
  css: ['film-grid'],
  render: (p) => `  <section class="film-grid padding" data-film-grid>
    <header>
      ${p.tag ? `<h2 class="t-mono orange">${esc(p.tag)}</h2>` : ''}
      <h3 class="t-m"><span style="display:block">${esc(p.heading)}</span></h3>
    </header>
    <div class="film-grid__grid" style="--limit:${p.mobileLimit || 3}">
${p.films.map((f, i) => `      <button class="film-grid__card" type="button" data-title="${esc(f.title + ' - ' + f.creator)}" data-poster="${f.still}"${f.award ? ` data-award="${esc(f.award)}"` : ''}>
        <div class="film-grid__visuals">
          <div class="film-grid__video-wrap" aria-hidden="true"><div class="film-grid__video"><img class="film-grid__preview" src="${f.still}" alt="" width="1792" height="1008" loading="lazy" decoding="async"></div></div>
          ${pic({ src: f.still, alt: '', w: 1792, h: 1008, cls: 'film-grid__image' })}
        </div>
        <div class="film-grid__info">
          <div class="film-grid__index t-mono-s">[ ${pad(i + 1)} ]</div>
          <div class="t-xsp"><h4>${esc(f.title)} - ${esc(f.creator)}</h4><div>${esc(f.type)}</div></div>
        </div>
      </button>`).join('\n')}
    </div>
    <button class="btn btn--border film-grid__button" type="button"><span class="t-mono-s">Load More</span></button>
  </section>`,
};
