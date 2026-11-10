'use strict';
// Home page blocks: hero:fullBleedCentered, glideTrack, quoteFrame, homeCourses, courseQuiz, iconTextBlocks, ctaMedia,
// testimonialCards and pricingTable. (stats, pricingCards, videoSlider and filmGrid are shared with other pages.)
// Every picture, name, figure and quote is an invented stand-in.
const { esc, arrow, pic } = require('../util.cjs');
const { LOGOS, logoHtml } = require('../data/logos.cjs');
const { boxArt } = require('../data/boxart.cjs');
const { _logo } = require('./course.cjs');

const CSS = ['home', 'enterprise', 'courses', 'course-hero', 'accordion', 'film-grid', 'course-blocks', 'boxart'];
const PLAY = '<svg class="btn__play" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3.4 2.1v7.8L9.9 6z" fill="currentColor"/></svg>';
const pad = (n) => String(n).padStart(2, '0');

/* ---------------- hero ---------------- */
exports['hero:fullBleedCentered'] = {
  css: CSS,
  render: (p) => `  <header class="hero-centered padding">
    <div class="hero-centered__inner">
      <div class="hero-centered__group">
        <div class="hero-centered__tag t-mono-s" data-split>${esc(p.tag)}</div>
        <h1 class="hero-centered__heading t-l" data-split>${esc(p.heading)}</h1>
      </div>
    </div>
    <div class="hero-centered__buttons">
      <div class="blurFade" style="--delay:1.1s"><a class="btn btn--orange" href="/courses"><span class="t-mono-s">Courses</span>${arrow('#fff')}</a></div>
      <div class="blurFade" style="--delay:1.15s"><button class="btn btn--light" type="button" data-watch data-poster="${p.image}" data-title="${esc(p.tag)}"><span class="t-mono-s">Watch trailer</span>${PLAY}</button></div>
    </div>
    <div class="hero-centered__video heroMediaClip" style="--delay:.5s" aria-hidden="true"><img src="${p.image}" alt="" width="1792" height="1008" fetchpriority="high" decoding="async"></div>
  </header>`,
};

/* ---------------- glideTrack: statements that glide past a grey reading band ---------------- */
exports.glideTrack = {
  css: CSS,
  render: (p) => `  <section class="glide padding">
    <header class="glide__header"><h2 class="glide__heading t-mb"><span style="display:block">${p.heading}</span></h2></header>
    <div class="glide__list" data-glide>
      <div class="glide__band" aria-hidden="true"><div class="glide__title-mask"><div class="glide__titles">${p.groups.map((g) => `<span class="glide__band-title t-xsb">${esc(g.title)}</span>`).join('')}</div></div></div>
${p.groups.map((g) => `      <div class="glide__group"><h3 class="glide__group-title t-xsb">${esc(g.title)}</h3><ul class="glide__track">${g.items.map((t) => `<li class="glide__item t-xsb">${esc(t)}</li>`).join('')}</ul></div>`).join('\n')}
    </div>
  </section>`,
};

/* ---------------- quoteFrame: full-screen testimonial slider with parallax pictures ---------------- */
exports.quoteFrame = {
  css: CSS,
  render: (p) => `  <section class="quote-frame" data-quote-frame aria-roledescription="carousel" aria-label="Student stories">
    <div class="quote-frame__viewport"><div class="quote-frame__container">
${p.quotes.map((q, i) => `      <div class="quote-frame__slide" aria-roledescription="slide" aria-label="${i + 1} of ${p.quotes.length}">
        <header class="padding"><span class="quote-frame__name t-xs">${esc(q.name)}</span><h2 class="t-ms"><span style="display:block">${esc(q.text)}</span></h2></header>
        <div class="quote-frame__parallax">${pic({ src: `/assets/img/${q.image}.jpg`, w: 1792, h: 1008, cls: 'quote-frame__image', sm: { src: `/assets/img/${q.imageSm}.jpg`, w: 1000, h: 1810 } })}</div>
      </div>`).join('\n')}
    </div></div>
    <div class="quote-frame__controls"><button type="button" data-prev aria-label="Previous story"></button><button type="button" data-next aria-label="Next story"></button></div>
  </section>`,
};

/* ---------------- homeCourses: the course list grouped by area ---------------- */
exports.homeCourses = {
  css: CSS,
  render: (p) => `  <section class="home-cards">
    <header><h2 class="t-m"><span style="display:block">${p.heading}</span></h2></header>
    <div class="home-cards__groups padding">
${p.groups.map((g) => `      <div class="home-cards__group">
        <div class="home-cards__group-header t-mono"><h3>${esc(g.title)}</h3><span class="home-cards__rule"></span></div>
        <div class="home-cards__cards">
${g.courses.map((c) => `          <article class="home-cards__card">
            <div class="home-cards__upper">
              <div class="home-cards__copy">
                <h4 class="vh-hidden">${esc(c.title)}</h4>
                <div class="home-cards__logo" style="--lh:${c.lh}rem;--lhm:${c.lhm}rem">${_logo(c)}</div>
                <p class="home-cards__overview t-mp">${esc(c.overview)}</p>
              </div>
              <ul class="home-cards__details">${c.contains.map((t) => `<li class="home-cards__detail t-mp"><span class="home-cards__dot"></span>${esc(t)}</li>`).join('')}</ul>
            </div>
            <div class="home-cards__lower">
              <div class="home-cards__meta">
                <div class="home-cards__cost t-sb"><span>$${c.cost}</span></div>
                <div class="home-cards__buttons">
                  <button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">JOIN NOW</span>${arrow('#fff')}</button>
                  <a class="btn btn--border" href="/courses/${c.slug}"><span class="t-mono-s">LEARN MORE</span>${arrow('#fff')}</a>
                </div>
              </div>
              <div class="home-cards__box-wrap"><div class="home-cards__box">${boxArt(c.box)}</div></div>
            </div>
          </article>`).join('\n')}
        </div>
      </div>`).join('\n')}
    </div>
  </section>`,
};

/* ---------------- courseQuiz: "which course?" with a collapsible quiz and a framed video ---------------- */
exports.courseQuiz = {
  css: CSS,
  render: (p) => `  <section class="quiz padding" id="quiz" data-quiz data-quiz-results='${JSON.stringify(p.results)}'>
    <header class="quiz__header"><div class="t-m"><span style="display:block">${esc(p.heading)}</span></div></header>
    <div class="quiz__buttons">
      <button class="btn btn--orange quiz__toggle" type="button" aria-expanded="false" aria-controls="quiz-form" data-quiz-toggle><span class="t-mono-s">${esc(p.quizLabel)}</span>${arrow('#fff')}</button>
      <a class="btn btn--orange quiz__button" href="#pricing"><span class="t-mono-s">${esc(p.pricingLabel)}</span>${arrow('#fff')}</a>
    </div>
    <div class="quiz__form" id="quiz-form" data-quiz-form aria-hidden="true" inert><div class="quiz__form-clip"><div class="quiz__form-inner" data-quiz-body></div></div></div>
    <div class="quiz__frame corners" data-quiz-frame>
      <button class="quiz__media" type="button" data-watch data-poster="${p.image}" data-title="${esc(p.videoTitle)}" aria-label="${esc(p.videoLabel)}">
        <img src="${p.image}" alt="" width="1792" height="1008" loading="lazy" decoding="async">
        <span class="quiz__play" aria-hidden="true"><svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="27.5" stroke="rgba(255,255,255,.35)"/><path d="M23 19.5v17l14-8.5z" fill="#fff"/></svg></span>
      </button>
    </div>
  </section>`,
};

/* ---------------- iconTextBlocks: six included benefits in an accordion beside a photo ---------------- */
const ICONS = {
  teach: '<path d="M5 6h14v12H5z"/><path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor"/>',
  clock: '<circle cx="12" cy="12" r="7"/><path d="M12 8v4.2l3 1.8"/>',
  call: '<path d="M5 7h10v10H5z"/><path d="m15 11 4-2.5v7L15 13"/>',
  people: '<circle cx="9" cy="9" r="2.4"/><circle cx="16" cy="10" r="2"/><path d="M4.5 17c.4-2.6 2.2-4 4.5-4s4.1 1.4 4.5 4M14 15.2c.6-.9 1.5-1.4 2.6-1.4 1.6 0 2.7.9 3 2.8"/>',
  doc: '<path d="M7 4.5h8l3 3V19.5H7z"/><path d="M10 11h5M10 14h5"/>',
  chat: '<path d="M5 6.5h14v9H12l-4 3v-3H5z"/>',
};
exports.iconTextBlocks = {
  css: CSS,
  render: (p) => `  <section class="icon-text padding" id="iconTextBlocks">
    <header><h2 class="t-m"><span style="display:block"><span style="color:#FFA200">${esc(p.heading[0])}</span><br>${esc(p.heading[1])}</span></h2></header>
    <div class="icon-text__image mediaParallax">${pic({ src: `/assets/img/${p.image}.jpg`, w: 1792, h: 2240, lazy: true })}</div>
    <ol class="icon-text__list" data-icon-text>
${p.blocks.map((b, i) => `      <li class="icon-text__tab">
        <button class="icon-text__button" type="button" aria-expanded="false" aria-controls="it-${i}">
          <span class="icon-text__header"><span class="icon-text__icon" aria-hidden="true"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffa200" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">${ICONS[b.icon]}</svg></span><span class="icon-text__title t-p">${esc(b.title)}</span></span>
          <span class="icon-text__view t-mono-s"><span class="icon-text__view-text desktop">View Less</span><span class="icon-text__brackets t-mono-s"><span>[</span><svg fill="none" height="14" viewBox="0 0 8 14" width="8" aria-hidden="true"><g fill="#fff"><path d="m7.5 6v1h-7v-1z"/><path d="m3.5 3h1v7h-1z"/></g></svg><span>]</span></span></span>
        </button>
        <div class="icon-text__panel" id="it-${i}" aria-hidden="true" inert><div class="icon-text__tab-body"><div class="icon-text__body-wrap"><div class="icon-text__body t-sp"><p>${esc(b.body)}</p></div></div></div></div>
      </li>`).join('\n')}
    </ol>
  </section>`,
};

/* ---------------- ctaMedia: a full-screen picture with a strip of (made-up) organisation marks ---------------- */
exports.ctaMedia = {
  css: CSS,
  render: (p) => `  <section class="cta-media">
    <header class="cta-media__header">
      <div class="cta-media__group">
        <p class="cta-media__title t-xs">${esc(p.title)}</p>
        <div class="cta-media__strip logo-marquee__slider" style="--n:${LOGOS.length}">
          <div class="logo-marquee__track">
${[...LOGOS, ...LOGOS].map((l, i) => `            <div class="logo-marquee__slide">${logoHtml(l, i >= LOGOS.length)}</div>`).join('\n')}
          </div>
        </div>
      </div>
    </header>
    <div class="cta-media__image mediaParallax">${pic({ src: `/assets/img/${p.image}.jpg`, w: 1792, h: 1008, sm: { src: `/assets/img/${p.imageSm}.jpg`, w: 1000, h: 1810 } })}</div>
  </section>`,
};

/* ---------------- testimonialCards ---------------- */
exports.testimonialCards = {
  css: CSS,
  render: (p) => `  <section class="testimonials padding">
    <header><h2 class="t-m"><span style="display:block">${esc(p.heading)}</span></h2></header>
    <div class="testimonials__cards">
${p.cards.map((c, i) => `      <div class="testimonials__card" data-card="${i}">
        <div class="testimonials__avatar">${pic({ src: `/assets/img/${c.image}.jpg`, w: 640, h: 640 })}</div>
        <div class="testimonials__heading t-xs">${esc(c.heading)}</div>
        <div class="testimonials__quote t-p"><div><p>${c.quote}</p></div><span class="testimonials__author t-p">${esc(c.author)}</span></div>
      </div>`).join('\n')}
    </div>
  </section>`,
};

/* ---------------- pricingTable: comparison grid ---------------- */
const CHECK = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Included" role="img"><path d="m6 12.5 4 4 8-9" stroke="#ffa200" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CROSS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Not included" role="img"><path d="m7.5 7.5 9 9m0-9-9 9" stroke="#505050" stroke-width="1.3" stroke-linecap="round"/></svg>';
exports.pricingTable = {
  css: CSS,
  render: (p) => {
    const cols = [p.columns[0], ...p.columns.slice(1)];
    return `  <section class="compare padding">
    <div class="compare__columns">
      <div class="compare__column">
        <div class="compare__heading t-xs" aria-hidden="true"></div>
        <ul class="compare__rows">${p.rows.map((r) => `<li class="compare__row t-p"><span>${esc(r.label)}</span></li>`).join('')}</ul>
      </div>
${cols.map((c, ci) => `      <div class="compare__column compare__column--${ci === 0 ? 'ours' : 'other'}">
        <div class="compare__heading t-xs">${c.logo ? `<svg class="compare__logo" viewBox="0 0 66 24" aria-label="${esc(c.name)}" role="img">${c.logo}</svg>` : esc(c.name)}</div>
        <ul class="compare__rows">${p.rows.map((r) => `<li class="compare__row t-p"><span class="mobile">${esc(r.label)}</span>${r.has[ci] ? CHECK : CROSS}</li>`).join('')}</ul>
      </div>`).join('\n')}
    </div>
  </section>`;
  },
};
