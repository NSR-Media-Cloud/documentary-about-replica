'use strict';
// Blocks of the course detail pages (also reused by the home page): hero, breakdown, quote, video slider,
// stats, community cards, pricing cards and the course card stack.
const { esc, pic, arrow } = require('../util.cjs');

const pad = (n) => String(n).padStart(2, '0');
const CSS = ['course-hero', 'courses', 'accordion', 'course-blocks', 'contactform', 'cta-click', 'text-media-cards'];
const PHOTOS = ['hero-1', 'hero-2', 'hero-3', 'hero-4', 'hero-5', 'hero-6', 'founder-1-lg', 'founder-2-lg', 'course-1', 'course-2', 'course-3', 'course-4'];

const logo = (c) => {
  const [a, b] = c.logo.lines;
  const s = c.logo.style;
  const inner = s === 'stack' || s === 'stack-light' ? `<small>${esc(a)}</small><b>${esc(b)}<sup>™</sup></b>`
    : s === 'mix' ? `<b>${esc(a)}<i>${esc(b)}</i><sup>™</sup></b>`
      : `<b>${esc(a)}<sup>™</sup></b>`;
  return `<div class="course-logo course-logo--${s}" aria-hidden="true">${inner}</div>`;
};

const BRACKETS = '<div class="accordion__brackets t-mono-s"><div>[</div><svg fill="none" height="14" viewBox="0 0 8 14" width="8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="#fff"><path d="m7.5 6v1h-7v-1z"/><path d="m3.5 3h1v7h-1z"/></g></svg><div>]</div></div>';
const CHECK = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m13.667 4-7.334 7.333L3 8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PLAY = '<svg class="btn__play" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3.4 2.1v7.8L9.9 6z" fill="currentColor"/></svg>';

/* ---------------- hero ---------------- */
const hero = (p) => {
  const c = p.course;
  const info = [['Format', p.format, '.5', '.55'], ['Access', p.access, '.55', '.65'], ['Completion', p.completion, '.7', '.75']];
  return `  <div class="course-hero__spacer" aria-hidden="true"></div>
  <header class="course-hero padding">
    <div class="course-hero__inner">
      <div class="course-hero__top">
${c.isNew ? '        <div class="course-hero__pill t-mono-s">New course</div>\n' : ''}        <div class="course-hero__title"><h1 class="vh-hidden">${esc(c.title)}</h1><div class="course-hero__logo moveUp" style="--delay:.45s">${logo(c)}</div></div>
        <div class="course-hero__line fillWidth" style="--delay:.4s"></div>
      </div>
      <div class="course-hero__info-wrap">
        <div class="course-hero__heading t-mono-s"><div class="moveUpF" style="--delay:.45s">Overview</div></div>
        <p class="course-hero__paragraph t-p blurFade" style="--delay:.5s">${esc(c.overview)}</p>
        <div class="course-hero__buttons">
          <div class="blurFade" style="--delay:.55s"><button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">JOIN NOW</span>${arrow('#fff')}</button></div>
          <div class="blurFade" style="--delay:.6s"><button class="btn btn--light" type="button"><span class="t-mono-s">Watch Video</span>${PLAY}</button></div>
        </div>
      </div>
      <div class="course-hero__flex">
${info.map(([h, v, d1, d2]) => `        <div><div class="course-hero__heading t-mono-s"><div class="moveUpF" style="--delay:${d1}s">${h}</div></div><div class="course-hero__info t-mono-s"><div class="moveUpF" style="--delay:${d2}s">${v}</div></div></div>`).join('\n')}
      </div>
      <div class="course-hero__contains">
        <div class="course-hero__heading t-mono-s"><div class="moveUpF" style="--delay:.55s">Contains</div></div>
        <div class="course-hero__info t-mono-s"><ul class="blurFade" style="--delay:.6s">${p.contains.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
      </div>
      <div class="course-hero__scroll t-mono-s"><div class="moveUpF" style="--delay:.7s">Scroll to Explore</div></div>
    </div>
    <div class="course-hero__media"><div class="mediaParallax" style="position:absolute;inset:0">${pic({ src: `/assets/img/${p.image}.jpg`, w: 1792, h: 1008, lazy: false, priority: true })}</div></div>
  </header>`;
};

/* ---------------- breakdown ---------------- */
const tab = (r, i) => `          <li class="accordion__tab">
            <button class="accordion__button" type="button" aria-expanded="false" aria-controls="chapter-${i}">
              <div class="accordion__index t-mono-s">[ ${pad(i + 1)} ]</div>
              <span class="accordion__heading t-p">${esc(r.title)}</span>
              <div class="accordion__tab-chapters desktop t-p">${r.lessons.length} Lessons</div>
              <div class="accordion__view t-mono-s"><div class="accordion__view-text desktop">View Less</div>${BRACKETS}</div>
            </button>
            <div class="accordion__panel" id="chapter-${i}" aria-hidden="true" inert>
              <div class="accordion__tab-body">
                <div class="accordion__chapters-mobile t-p">${r.lessons.length} Lessons</div>
                <ul class="accordion__body-list">${r.lessons.map(([t, d], j) => `<li class="accordion__inner-item t-sp"><div class="accordion__item-title">${esc(t)}</div><div class="accordion__duration">${d}</div><div class="accordion__item-index desktop">${pad(j + 1)}</div></li>`).join('')}</ul>
              </div>
            </div>
          </li>`;

const breakdown = (p) => `  <section class="accordion padding" id="course-breakdown">
    <header class="accordion__header">
      <h2 class="accordion__tag t-mono orange">Course Breakdown</h2>
      <div class="accordion__lead">
        <h3 class="accordion__title t-m">${esc(p.heading)}</h3>
        <div class="accordion__buttons"><button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">${p.button}</span>${arrow('#fff')}</button></div>
      </div>
    </header>
    <div class="accordion__slider"><div class="accordion__slider-viewport" tabindex="0" role="group" aria-label="Chapters"><div class="accordion__slider-container">
${p.cards.map((t, i) => `      <div class="accordion__card">${pic({ src: `/assets/img/${PHOTOS[i % PHOTOS.length]}.jpg`, w: 1320, h: 744, alt: '', style: (p.cardRatio || {})[i + 1] ? `aspect-ratio:${p.cardRatio[i + 1]}` : '' })}<div class="accordion__card-info"><div class="accordion__card-index t-mono-s">[ ${pad(i + 1)} ]</div><div class="t-xsp"><h4>${esc(t)}</h4></div></div></div>`).join('\n')}
    </div></div></div>
    <div class="accordion__progress" aria-hidden="true"></div>
    <div class="accordion__list-wrap" id="course-list" aria-hidden="true" inert>
      <ol class="accordion__list">
${p.rows.map(tab).join('\n')}
      </ol>
    </div>
    <div class="accordion__toggle-wrap"><button class="btn btn--light accordion__toggle" type="button" aria-expanded="false" aria-controls="course-list"><span class="t-mono-s" data-label>Show Course Breakdown</span>${arrow('#000')}</button></div>
  </section>`;

/* ---------------- quote / stats ---------------- */
const quote = (p) => `  <section class="scroll-text scroll-text--quote padding">
    ${pic({ src: `/assets/img/${p.image}.jpg`, w: 848, h: 476, cls: 'scroll-text__thumb' })}
    <figure>
      <blockquote class="scroll-text__paragraph t-m">
        <div class="t-m" data-lines>${esc(p.text)}</div>
        <div class="scroll-text__abs t-m" data-lines data-abs aria-hidden="true">${esc(p.text)}</div>
      </blockquote>
      <figcaption class="t-mono">${esc(p.author)}</figcaption>
    </figure>
  </section>`;

const stats = (p) => `  <section class="stats padding">
    <header><h2 class="t-mono orange" aria-hidden="true"></h2><h3 class="t-m">${esc(p.heading)}</h3></header>
    <div class="stats__row">
${p.items.map(([l, n]) => `      <div class="stats__item"><span class="t-mono-s">${esc(l)}</span><div class="stats__number t-xl">${esc(n)}</div></div>`).join('\n')}
    </div>
  </section>`;

/* ---------------- video slider ---------------- */
const PLAY_CIRCLE = '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true"><circle cx="28" cy="28" r="27.5" stroke="#fff"/><path d="M38.5 27.134c.667.385.667 1.347 0 1.732l-14.5 8.37c-.667.385-1.5-.096-1.5-.866V19.63c0-.77.833-1.25 1.5-.866z" fill="#fff"/></svg>';
const videoSlider = (p) => `  <section class="video-slider">
    <header><h2 class="t-mono orange" aria-hidden="true"></h2><h3 class="t-m">${esc(p.heading)}</h3></header>
    <div class="video-slider__stage">
      <div class="video-slider__names t-mono-s" aria-live="polite">${p.names.map((n, i) => `<div class="video-slider__name${i === 0 ? ' is-active' : ''}">${esc(n)}</div>`).join('')}</div>
      <div class="video-slider__wrap">
        <div class="video-slider__viewport"><div class="video-slider__track">
${p.names.map((n, i) => `          <div class="video-slider__slide"><button class="video-slider__video${i === 0 ? ' is-active' : ''}" type="button" aria-label="Play the story from ${esc(n)}">${pic({ src: `/assets/img/${PHOTOS[(i * 2 + 1) % PHOTOS.length]}.jpg`, w: 1792, h: 1008 })}<span class="video-slider__play">${PLAY_CIRCLE}</span></button></div>`).join('\n')}
        </div></div>
        <div class="video-slider__frame" aria-hidden="true"><div class="corners"></div></div>
      </div>
      <div class="video-slider__ruler" aria-hidden="true"><div class="video-slider__ticks">${p.names.map((n, i) => `<span>|</span><span${i === 0 ? ' class="is-active"' : ''}>${pad(i + 1)}</span>`).join('')}<span>|</span></div></div>
    </div>
  </section>`;

/* ---------------- community cards ---------------- */
const ICONS = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 11v8H4v-8zm0 0 3-6c1.7 0 2.5 1.2 2.2 3L12 11h5.5a1.5 1.5 0 0 1 1.45 1.9l-1.6 5.6A1.5 1.5 0 0 1 15.9 20H7" stroke="#fff" stroke-linejoin="round"/></svg><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5h16v11H11l-4.5 3v-3H4z" stroke="#fff" stroke-linejoin="round"/></svg><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 5l7 6.5-7 6.5v-4c-4 0-7 1-9 4 0-5 3-9 9-9.5z" stroke="#fff" stroke-linejoin="round"/></svg>';
const GLOBE = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5.5" stroke="#b3b3b3"/><path d="M1 6h10M6 1c2 2 2 8 0 10M6 1c-2 2-2 8 0 10" stroke="#b3b3b3"/></svg>';
const social = (p) => `  <section class="social-cards padding">
    <header><h2 class="t-m"><span style="display:block">${esc(p.heading)}</span></h2></header>
    <div class="social-cards__cards">
${p.cards.map((c) => `      <div class="social-cards__wrap"><h3 class="t-xs">${esc(c.heading)}</h3><div class="social-cards__card">${c.video
    ? `<div class="social-cards__video" style="display:flex;justify-content:center;align-items:center;height:100%;padding:0">${pic({ src: `/assets/img/${c.video}.jpg`, w: 300, h: 569, cls: 'social-cards__poster' })}</div>`
    : `<div class="social-cards__profile"><div class="social-cards__avatar"></div><div><div class="social-cards__name">${esc(c.name)}</div><div class="social-cards__date"><div>${esc(c.date)}</div><div>•</div>${GLOBE}</div></div></div><div class="social-cards__text t-sp">${esc(c.text)}</div>${pic({ src: `/assets/img/${c.image}.jpg`, w: c.w || 900, h: c.h || 542, cls: 'social-cards__image', style: `--ratio-d:${c.w || 900}/${c.h || 542};--ratio-m:${(c.ratioM || ((c.w || 900) + ' / ' + (c.h || 542))).replace(/ /g, '')}` })}<div class="social-cards__icons">${ICONS}</div>`}</div></div>`).join('\n')}
    </div>
  </section>`;

/* ---------------- pricing ---------------- */
const strip = (items) => `<div class="pricing__strip"><div class="pricing__strip-track">${Array.from({ length: 6 }, (_, i) => `<div class="pricing__strip-slide"><div class="pricing__save"><span class="t-p">${esc(items[i % items.length])}</span><span class="t-p">•</span></div></div>`).join('')}</div></div>`;
const rows = (list) => `<ul class="pricing__rows">${list.map((t) => `<li class="t-p"><span>${esc(t)}</span>${CHECK}</li>`).join('')}</ul>`;
const pricing = (p) => `  <section class="pricing padding" id="pricing">
    ${p.heading ? `<header><h2 class="t-m"><span style="display:block">${esc(p.heading)}</span></h2>${p.body ? `<div class="t-p"><p>${esc(p.body)}</p></div>` : ''}</header>
    ` : ''}<div class="pricing__cards">
      <div class="pricing__card pricing__card--orange">
        <div class="pricing__tag-wrap"><div class="pricing__tag t-p">Individual Course</div></div>
        <div><div class="pricing__info"><div class="pricing__price-text t-p">Starting at</div><div class="pricing__price-wrap"><div class="pricing__price t-l t-lb">$${p.cost}</div></div></div></div>
        ${strip(['Choose Individual Courses'])}
        <div class="pricing__bottom">${rows(p.rows)}<a class="btn btn--orange pricing__button" href="/courses"><span class="t-mono-s">Get Started</span>${arrow('#fff')}</a></div>
      </div>
      <div class="pricing__card">
        <div class="pricing__tag-wrap"><div class="pricing__tag t-p">Membership</div></div>
        <div><div class="pricing__info"><div class="pricing__price-text t-p">Starting at</div><div class="pricing__price-wrap"><div class="pricing__price t-l t-lb">$${p.member}</div></div></div></div>
        ${strip([p.strip2])}
        <div class="pricing__bottom">${rows(p.rows)}<a class="btn btn--border pricing__button" href="/courses"><span class="t-mono-s">Get Started</span>${arrow('#fff')}</a></div>
      </div>
      <div class="pricing__card">
        <div class="pricing__tag-wrap"><div class="pricing__tag t-p">Bundles</div></div>
        <div><div class="pricing__info"><div class="pricing__percentage-text t-xs">UP TO</div><div class="pricing__percentage t-l t-lb">40% OFF</div></div></div>
        ${strip(p.bundleStrip)}
        <div class="pricing__bottom">${pic({ src: '/assets/img/course-2.jpg', w: 382, h: 171, cls: 'pricing__image' })}${rows(p.bundleRows)}<a class="btn btn--border pricing__button" href="/courses"><span class="t-mono-s">Get Started</span>${arrow('#fff')}</a></div>
      </div>
    </div>
  </section>`;

/* ---------------- course card stack ---------------- */
const stack = (p) => `  <section class="card-stack padding">
    <header><h2 class="t-mono orange" aria-hidden="true"></h2><h3 class="t-m">${esc(p.heading)}</h3></header>
    <div class="card-stack__stack">
${p.courses.map((c) => `      <a class="card-stack__card" href="/courses/${c.slug}"><h4 class="vh-hidden">${esc(c.title)}</h4><div class="card-stack__logo">${logo(c)}</div><div class="card-stack__overview t-sp">${esc(c.overview)}</div><div class="card-stack__info t-mono-s"><div>${esc(c.videos)}</div><div>•</div><div>${esc(c.hours)}</div></div><div class="card-stack__arrow">${arrow('#000')}</div>${pic({ src: `/assets/img/course-${c.n}.jpg`, w: 660, h: 920, cls: 'card-stack__image' })}</a>`).join('\n')}
    </div>
  </section>`;

/* ---------------- wrapper: everything after the hero ---------------- */
const body = (p, page, registry) => `  <div class="course-body">
${p.blocks.map((b) => registry[b.block].render(b, page, registry)).join('\n\n')}
  </div>`;

module.exports = {
  courseHero: { css: CSS, render: hero },
  courseBody: { css: CSS, render: body },
  'accordion:courseBreakdown': { css: CSS, render: breakdown },
  quote: { css: CSS, render: quote },
  videoSlider: { css: CSS, render: videoSlider },
  stats: { css: CSS, render: stats },
  socialCards: { css: CSS, render: social },
  pricingCards: { css: CSS, render: pricing },
  courseCardStack: { css: CSS, render: stack },
  _logo: logo,
};
