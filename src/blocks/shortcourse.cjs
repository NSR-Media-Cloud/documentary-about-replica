'use strict';
// "Short course" page blocks (the single-product course page): shortCourseHero, infoCards (a textMediaCards variant),
// courseBanner and the CSS-drawn product box they both show. Box art, "documents" and the wordmark are original stand-ins.
const { esc, arrow, pic } = require('../util.cjs');
const { festival } = require('../data/badges.cjs');
const { boxArt } = require('../data/boxart.cjs');

const CSS = ['short-course', 'boxart', 'course-hero', 'text-media-cards', 'cta-click', 'accordion'];

const wordmark = (t) => `<span class="short-hero__wordmark">${esc(t)}<sup>™</sup></span>`;

/* ---------------- hero ---------------- */
exports.shortCourseHero = {
  css: CSS,
  render: (p) => `  <div class="short-hero__spacer" aria-hidden="true"></div>
  <header class="short-hero padding">
    <div class="short-hero__inner">
      <div class="short-hero__top">
        <div class="short-hero__title"><h1 class="vh-hidden">${esc(p.title)}</h1><div class="short-hero__logo moveUp" style="--delay:.45s">${wordmark(p.title)}</div></div>
        <div class="short-hero__line fillWidth" style="--delay:.4s"></div>
      </div>
      <div class="short-hero__info-wrap">
        <div class="t-mono-s"><div class="moveUpF" style="--delay:.45s">Overview</div></div>
        <p class="short-hero__paragraph t-p blurFade" style="--delay:.5s">${esc(p.overview)}</p>
        <div class="short-hero__price t-p blurFade" style="--delay:.525s">${esc(p.price)}</div>
        <div class="short-hero__buttons"><div class="blurFade" style="--delay:.55s"><button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">Purchase Now</span>${arrow('#fff')}</button></div></div>
      </div>
      <div class="short-hero__box-wrap"><div class="short-hero__box blurFade" style="--delay:.5s">${boxArt(p.box)}</div></div>
      <div class="short-hero__scroll t-mono-s"><div class="moveUpF" style="--delay:.7s">Scroll to Explore</div></div>
    </div>
    <div class="short-hero__video" aria-hidden="true"><div class="mediaParallax" style="position:absolute;inset:0"><img src="${p.image}" alt="" width="1792" height="1008" fetchpriority="high" decoding="async"></div></div>
  </header>`,
};

/* the same wrapper the long course pages use: everything after the fixed hero scrolls over it */
exports.shortCourseBody = {
  css: CSS,
  render: (p, page, registry) => `  <div class="course-body">
${p.blocks.map((b) => registry[b.block].render(b, page, registry)).join('\n\n')}
  </div>`,
};

/* ---------------- infoCards: "What's included" ---------------- */
const doc = (kind) => {
  if (kind === 'budget') {
    return `<div class="tmc__doc" style="--rot:-4deg" aria-hidden="true"><i style="--w:46%;--h:4.2%"></i>${[72, 58, 66, 40, 61, 52, 70, 34].map((w, i) => `<i style="--w:${w}%;--h:2.6%${i % 3 === 2 ? ';--o:.55' : ''}"></i>`).join('')}<i class="tmc__doc-total" style="--w:38%;--h:3.4%"></i></div>`;
  }
  if (kind === 'schedule') {
    return `<div class="tmc__doc tmc__doc--grid" style="--rot:3deg" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--w:${[78, 90, 64][i % 3]}%;--h:2.8%${i % 6 === 0 ? ';--o:.9' : ''}"></i>`).join('')}</div>`;
  }
  return `<div class="tmc__doc tmc__doc--dark" style="--rot:-2deg" aria-hidden="true">${festival({ kicker: 'OFFICIAL SELECTION', lines: ['HARBOR LIGHTS', 'FILM FESTIVAL'], year: '2027', wreath: 4 })}</div>`;
};

exports.infoCards = {
  css: CSS,
  render: (p) => `  <section class="tmc tmc--info padding">
    <header><h2 class="t-m"><span style="display:block">${esc(p.heading)}</span></h2></header>
    <p class="tmc__subheading t-mono-s">${esc(p.subheading)}</p>
    <div class="tmc__cards">
      <div class="tmc__viewport" tabindex="0" role="group" aria-label="Cards"><div class="tmc__track">
${p.cards.map((c) => `        <div class="tmc__slide"><div class="tmc__card">
          <div class="tmc__info"><h3 class="t-xs"><span style="display:block">${esc(c.title)}</span></h3></div>
          <div class="tmc__media">${pic({ src: `/assets/img/${c.image}.jpg`, w: 1792, h: 2240 })}${doc(c.doc)}</div>
        </div></div>`).join('\n')}
      </div></div>
      <div class="tmc__progress" aria-hidden="true"></div>
    </div>
  </section>`,
};

/* ---------------- courseBanner: a promo strip + the product ---------------- */
exports.courseBanner = {
  css: CSS,
  render: (p) => {
    const item = `<span class="course-banner__item t-mono-s">${esc(p.promo)}<span class="course-banner__dot">•</span></span>`;
    return `  <section class="course-banner padding">
    <div class="course-banner__banner">
      <div class="course-banner__marquee"><span class="vh-hidden">${esc(p.promo)}</span><div class="course-banner__track" aria-hidden="true">${item.repeat(24)}</div></div>
      <div class="course-banner__inner">
        <div class="course-banner__content">
          <div class="course-banner__logo">${wordmark(p.title)}</div>
          <p class="course-banner__overview t-p">${esc(p.overview)}</p>
          <ul class="course-banner__contains">
${p.contains.map((t) => `            <li class="course-banner__contains-item t-p"><span class="course-banner__plus">+</span>${esc(t)}</li>`).join('\n')}
          </ul>
          <div class="course-banner__price-wrap"><span class="course-banner__price-label t-p">${esc(p.priceLabel)}</span><span class="course-banner__price t-p">${esc(p.price)}</span></div>
          <div class="course-banner__buttons"><button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">Purchase Now</span>${arrow('#fff')}</button></div>
        </div>
        <div class="course-banner__box-wrap"><div class="course-banner__box">${boxArt(p.box)}</div></div>
      </div>
      <div class="course-banner__bg" aria-hidden="true"><img src="${p.image}" alt="" width="1792" height="1008" loading="lazy" decoding="async"></div>
    </div>
  </section>`;
  },
};
