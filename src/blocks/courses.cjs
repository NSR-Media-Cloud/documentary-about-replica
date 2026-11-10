'use strict';
// /courses — header with an Editorial / Grid toggle, the stacked full-screen cards, and the compact list view.
const { esc, pic, arrow } = require('../util.cjs');
const courses = require('../data/courses.cjs');

const PLUS = '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true"><g fill="#ffa200"><path d="m7.5 6v1h-7v-1z"/><path d="m3.5 3h1v7h-1z"/></g></svg>';
const TOGGLE_ICON = (delay) => `<svg class="moveUpF" style="--delay:${delay}s" fill="none" height="14" viewBox="0 0 19 14" width="19" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="currentColor"><path d="m4 11.5h-2.81651v-10h2.81651v-1h-4v12h4z"/><circle cx="9.5" cy="6.5" r="2"/><path d="m15 11.5h2.8165v-10h-2.8165v-1h4v12h-4z"/></g></svg>`;

const logo = (c) => {
  const [a, b] = c.logo.lines;
  const s = c.logo.style;
  const inner = s === 'stack' || s === 'stack-light' ? `<small>${esc(a)}</small><b>${esc(b)}<sup>™</sup></b>`
    : s === 'mix' ? `<b>${esc(a)}<i>${esc(b)}</i><sup>™</sup></b>`
      : `<b>${esc(a)}<sup>™</sup></b>`;
  return `<div class="course-logo course-logo--${s}" aria-hidden="true">${inner}</div>`;
};

const marquee = (text, bottom) => `<div class="marquee${bottom ? ' marquee--bottom' : ''}" aria-hidden="true"><div class="marquee__track">${Array.from({ length: 14 }, () => `<div class="marquee__slide"><div class="marquee__save t-mono-s"><span>${esc(text)}</span><span>•</span></div></div>`).join('')}</div></div>`;

const buttons = (c) => `<button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">JOIN NOW</span>${arrow('#fff')}</button><a class="btn btn--border" href="/courses/${c.slug}"><span class="t-mono-s">Explore</span>${arrow('#fff')}</a>`;

const editorial = (c, i) => `      <article class="editorial__course" id="course-${c.slug}">
${c.isNew ? `        ${marquee(c.ribbon, false)}\n` : ''}        <div class="editorial__image">${pic({ src: `/assets/img/${c.img}.jpg`, w: 1792, h: 1008, lazy: i > 0 })}</div>
        <div class="editorial__inner">
          <div class="editorial__tag t-mono-s">Course ${String(c.n).padStart(2, '0')}</div>
${c.isNew ? '          <div class="editorial__pill t-mono-s"><div class="moveUpF" style="--delay:.4s">New</div></div>\n' : ''}          <div class="editorial__heading"><h2 class="vh-hidden">${esc(c.title)}</h2>${logo(c)}</div>
          <div class="editorial__overview"><div class="t-mono-s">Overview</div><p class="t-p">${esc(c.overview)}</p></div>
          <div class="editorial__included-wrap"><div class="t-mono-s">What’s Included</div><ul class="editorial__included t-mono-s">${c.included.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
          <div class="editorial__lower"><div class="editorial__cost t-p"><div>$${c.cost}</div></div><div class="editorial__buttons">${buttons(c)}</div></div>
        </div>
      </article>`;

const gridRow = (c, i) => `      <div class="course-grid__course">
        <div class="course-grid__tag t-mono-s">${c.isNew ? '<span class="is-new">[ New ]</span>' : ''}<span>Course ${c.n}</span><span class="course-grid__line"></span>${c.isNew ? '<span class="is-new">[ New ]</span>' : ''}</div>
        <div class="course-grid__inner">
          <div>
            <h2 class="vh-hidden">${esc(c.title)}</h2>
            <div class="course-grid__logo">${logo(c)}</div>
            <div class="course-grid__upper">
              <p class="t-sp">${esc(c.overview)}</p>
              <div class="course-grid__included-wrap"><div class="t-mono-s">What’s Included</div><div class="course-grid__included t-mono-s">${c.included.map((t) => `<div class="course-grid__item">${PLUS}${esc(t)}</div>`).join('')}</div></div>
            </div>
            <div class="course-grid__lower"><div class="course-grid__cost t-p"><div>$${c.cost}</div></div><div class="course-grid__buttons">${buttons(c)}</div></div>
          </div>
        </div>
        <div class="course-grid__image-wrap">${pic({ src: `/assets/img/${c.img}.jpg`, w: 1792, h: 1008 })}${c.isNew ? marquee(c.ribbon, true) : ''}</div>
      </div>`;

exports.coursesPage = {
  css: ['courses'],
  render: (p) => `  <div data-courses>
    <header class="courses-head padding">
      <div class="courses-head__grid">
        <h1 class="courses-head__tag t-mono orange"><span class="moveUpF" style="--delay:.3s">${esc(p.tag)}</span></h1>
        <h2 class="courses-head__heading t-l"><span class="moveUp" style="--delay:.35s">${esc(p.heading)}</span></h2>
        <div class="courses-head__toggle t-mono-s" role="group" aria-label="Course layout">
          <button class="is-active" type="button" aria-pressed="true"><span>${TOGGLE_ICON('.4')}<span class="moveUpF" style="--delay:.45s">Editorial</span></span></button>
          <button type="button" aria-pressed="false"><span>${TOGGLE_ICON('.5')}<span class="moveUpF" style="--delay:.55s">Grid</span></span></button>
        </div>
        <div class="courses-head__paragraph t-p"><span class="moveUpF" style="--delay:.45s">${esc(p.body)}</span></div>
      </div>
    </header>
    <div class="editorial blurFade" style="--delay:.6s">
${courses.map(editorial).join('\n')}
    </div>
    <div class="course-grid" hidden>
${courses.map(gridRow).join('\n')}
    </div>
  </div>`,
};
