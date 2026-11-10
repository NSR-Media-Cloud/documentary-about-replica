'use strict';
// Module (add-on) pages: a hero like the course hero (blue accent, price column) and a "what's included" breakdown.
const { esc, pic } = require('../util.cjs');
const { _logo } = require('./course.cjs');

const CSS = ['course-hero', 'courses', 'course-blocks', 'contactform', 'addon'];
const PLAY = '<svg class="btn__play" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3.4 2.1v7.8L9.9 6z" fill="currentColor"/></svg>';
const pad = (n) => String(n).padStart(2, '0');

const hero = (p) => `  <div class="course-hero__spacer" aria-hidden="true"></div>
  <header class="course-hero course-hero--addon padding">
    <div class="course-hero__inner">
      <div class="course-hero__top">
        <div class="course-hero__title"><h1 class="vh-hidden">${esc(p.name)}</h1><div class="course-hero__logo moveUp" style="--delay:.45s">${_logo({ logo: { style: 'light', lines: [p.name] } })}</div></div>
        <div class="course-hero__line fillWidth" style="--delay:.4s"></div>
      </div>
      <div class="course-hero__info-wrap">
        <div class="course-hero__heading t-mono-s"><div class="moveUpF" style="--delay:.45s">Overview</div></div>
        <p class="course-hero__paragraph t-p blurFade" style="--delay:.5s">${esc(p.description)}</p>
        <div class="course-hero__buttons"><div class="blurFade" style="--delay:.6s"><button class="btn btn--light" type="button"><span class="t-mono-s">Watch Video</span>${PLAY}</button></div></div>
      </div>
      <div class="course-hero__flex">
${[['Format', p.format, '.5', '.55'], ['Access', 'Lifetime', '.55', '.65'], ['Price', p.price, '.75', '.8']].map(([h, v, d1, d2]) => `        <div><div class="course-hero__heading t-mono-s"><div class="moveUpF" style="--delay:${d1}s">${h}</div></div><div class="course-hero__info t-mono-s${h === 'Price' ? ' course-hero__cost' : ''}"><div class="moveUpF" style="--delay:${d2}s">${v}</div></div></div>`).join('\n')}
      </div>
      <div class="course-hero__scroll t-mono-s"><div class="moveUpF" style="--delay:.7s">Scroll to Explore</div></div>
    </div>
    <div class="course-hero__media"><div class="mediaParallax" style="position:absolute;inset:0">${pic({ src: `/assets/img/${p.image}.jpg`, w: 1792, h: 1008, lazy: false, priority: true })}</div></div>
  </header>`;

const breakdown = (p) => `  <section class="sessions padding" id="sessionsBreakdown">
    <header class="sessions__header"><h2 class="sessions__tag t-mono">${esc(p.tag)}</h2></header>
    <div class="sessions__list">
${p.sections.map((s) => `      <div class="sessions__block">
        <h3 class="sessions__title t-m">${esc(s.title)}</h3>
        <div class="sessions__items">
${s.items.map((t, i) => `          <div class="sessions__item t-p"><span class="sessions__index">[${pad(i + 1)}]</span><p>${esc(t)}</p></div>`).join('\n')}
        </div>
      </div>`).join('\n')}
    </div>
  </section>`;

module.exports = {
  addOnHero: { css: CSS, render: hero },
  sessionsBreakdown: { css: CSS, render: breakdown },
};
