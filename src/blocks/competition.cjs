'use strict';
// Competition / accelerator page blocks: hero:infoVideo, imageBlocks (award categories), fullVideo, textBlocks (rules),
// filmStack (previous winners) and laurels. Every "video" is a still with a slow push-in: this study ships no footage.
const { esc, arrow, pic } = require('../util.cjs');
const { winner, festival } = require('../data/badges.cjs');
const { logo } = require('../data/brand.cjs');

const PLAY = '<svg class="btn__play" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3.4 2.1v7.8L9.9 6z" fill="currentColor"/></svg>';
const watchBtn = (cls = '') => `<span class="btn btn--border${cls ? ' ' + cls : ''}"><span class="t-mono-s">Watch Video</span>${PLAY}</span>`;

/* ---------------- hero:infoVideo ---------------- */
exports['hero:infoVideo'] = {
  css: ['info-video'],
  render: (p) => `  <header class="info-video padding">
    <div class="info-video__inner">
      <div class="info-video__top">
        <h1 class="info-video__title t-l" data-split>${esc(p.heading)}</h1>
        <div class="info-video__line fillWidth" style="--delay:.5s"></div>
      </div>
      <div class="info-video__info-wrap">
        <div class="info-video__heading t-mono-s"><div class="moveUpF" style="--delay:.45s">Overview</div></div>
        <p class="info-video__paragraph t-p blurFade" style="--delay:.5s">${esc(p.overview)}</p>
        <div class="info-video__buttons">
          <div class="blurFade" style="--delay:.55s">${p.button.popup
    ? `<button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">${esc(p.button.label)}</span>${arrow('#fff')}</button>`
    : `<a class="btn btn--orange" href="${p.button.href}"><span class="t-mono-s">${esc(p.button.label)}</span>${arrow('#fff')}</a>`}</div>
          <div class="blurFade" style="--delay:.6s"><button class="btn btn--border" type="button" data-watch data-poster="${p.image}" data-title="${esc(p.heading)}"><span class="t-mono-s">Watch Video</span>${PLAY}</button></div>
        </div>
      </div>
      <div class="info-video__grid">
${p.info.map(([h, v], i) => `        <div class="info-video__item"><div class="info-video__heading t-mono-s"><div class="moveUpF" style="--delay:${(0.5 + i * 0.05).toFixed(2)}s">${esc(h)}</div></div><div class="info-video__info t-mono-s"><div class="moveUpF" style="--delay:${(0.55 + i * 0.05).toFixed(2)}s">${esc(v)}</div></div></div>`).join('\n')}
      </div>
      <div class="info-video__scroll t-mono-s"><div class="moveUpF" style="--delay:.7s">Scroll to Explore</div></div>
    </div>
    <div class="info-video__video" aria-hidden="true"><div class="mediaParallax" style="position:absolute;inset:0"><img src="${p.image}" alt="" width="1792" height="1008" fetchpriority="high" decoding="async"></div></div>
  </header>`,
};

/* ---------------- imageBlocks: the award categories on a ruled grid ---------------- */
exports.imageBlocks = {
  css: ['competition'],
  render: (p) => `  <section class="image-blocks padding" data-image-blocks>
    <header>
      <h2 class="t-mono orange">${esc(p.tag)}</h2>
      <h3 class="t-m"><span style="display:block">${p.heading}</span></h3>
    </header>
    <div class="image-blocks__grid">
      <ul class="image-blocks__blocks">
${p.blocks.map((b, i) => `        <li>${winner({ label: b, wreath: (i % 5) + 1, wide: true })}</li>`).join('\n')}
      </ul>
      <div class="image-blocks__lines" aria-hidden="true">
        <div data-line="vertical" style="top:16.666666666666664%"></div><div data-line="vertical" style="top:50%"></div><div data-line="vertical" style="top:83.33333333333334%"></div>
        <div data-line="left" style="top:33.33333333333333%"></div><div data-line="left" style="top:66.66666666666666%"></div>
        <div data-line="right" style="top:33.33333333333333%"></div><div data-line="right" style="top:66.66666666666666%"></div>
      </div>
    </div>
  </section>`,
};

/* ---------------- fullVideo: a 16:9 "video" with a film-strip border ---------------- */
exports.fullVideo = {
  css: ['competition'],
  render: (p) => `  <section class="full-video">
    <button class="full-video__btn" type="button" data-watch data-poster="${p.image}" data-title="${esc(p.title)}" aria-label="Watch video: ${esc(p.title)}">
      <span class="full-video__frame">
        <img class="full-video__img" src="${p.image}" alt="" width="1792" height="1008" loading="lazy" decoding="async">
        <span class="full-video__strip full-video__strip--l"></span><span class="full-video__strip full-video__strip--r"></span>
        <span class="full-video__card">
          <svg class="full-video__logo" viewBox="0 0 ${logo.w} ${logo.h}" fill="currentColor" aria-hidden="true"><path d="${logo.d}"/></svg>
          <span class="full-video__name">${esc(p.name)}</span>
          <span class="full-video__rule"></span>
          <span class="full-video__tagline">${esc(p.tagline)}</span>
        </span>
      </span>
      <span class="full-video__watch">${watchBtn()}</span>
    </button>
  </section>`,
};

/* ---------------- textBlocks: heading + button, then a ruled two-column list ---------------- */
exports.textBlocks = {
  css: ['competition'],
  render: (p) => `  <section class="text-blocks padding" id="overview">
    <header>
      <h2 class="t-mono">${esc(p.tag)}</h2>
      <div class="text-blocks__inner">
        <h3 class="t-m">${esc(p.heading)}</h3>
        <div class="text-blocks__body t-p"></div>
        <a class="btn btn--light" href="${p.button.href}"><span class="t-mono-s">${esc(p.button.label)}</span>${arrow('#000')}</a>
      </div>
    </header>
    <ul class="text-blocks__blocks">
${p.blocks.map(([h, b]) => `      <li><h4 class="t-s">${esc(h)}</h4><p class="t-sp">${esc(b)}</p></li>`).join('\n')}
    </ul>
  </section>`,
};

/* ---------------- filmStack: previous winners, full-height sticky cards ---------------- */
exports.filmStack = {
  css: ['competition'],
  render: (p) => `  <section class="film-stack">
    <header>
      <h2 class="t-mono orange">${esc(p.tag)}</h2>
      <h3 class="t-m">${esc(p.heading)}</h3>
    </header>
    <div class="film-stack__stack">
${p.films.map((f) => `      <div class="film-stack__film">
        <div class="film-stack__video" aria-hidden="true"><img src="${f.still}" alt="" width="1792" height="1008" loading="lazy" decoding="async"></div>
        <button class="film-stack__btn" type="button" data-watch data-poster="${f.still}" data-title="${esc(f.title + ' - ' + f.creator)}">
          <span class="film-stack__inner">
            <span class="film-stack__creator t-mono-s">${esc(f.creator)}</span>
            <span class="film-stack__title t-s">${esc(f.title)}</span>
            ${watchBtn()}
          </span>
        </button>
      </div>`).join('\n')}
    </div>
  </section>`,
};

/* ---------------- laurels: a wrapped row of festival laurels ---------------- */
exports.laurels = {
  css: ['competition'],
  render: (p) => `  <section class="laurels padding">
    <header>
      <h2 class="t-mono orange">${esc(p.tag)}</h2>
      <h3 class="t-m">${esc(p.heading)}</h3>
    </header>
    <div class="laurels__row">
${p.laurels.map((l, i) => `      <div class="laurels__item">${festival({ ...l, wreath: l.wreath || ((i + 2) % 9) + 1 })}</div>`).join('\n')}
    </div>
  </section>`,
};
