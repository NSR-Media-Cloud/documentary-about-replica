'use strict';
// Full-screen call to action with a click-to-drop photo effect (ctaClickImages).
const { esc, pic, arrow } = require('../util.cjs');

exports.ctaClickImages = {
  css: ['cta-click', 'course-hero', 'courses', 'accordion', 'course-blocks', 'contactform'],
  render: (p) => `  <${p.href ? `a class="cta-click" href="${p.href}"` : `section class="cta-click" data-cta-click data-photos='${JSON.stringify((p.drops || []).map((n) => `/assets/img/${n}.jpg`))}'`}>
    <div class="cta-click__bg">${pic({ src: `/assets/img/${p.image}.jpg`, w: 1792, h: 1008 })}</div>
    <header>
      <div class="cta-click__copy">
        <h2 class="t-ms"><span style="display:block">${esc(p.heading)}</span></h2>
        <div class="cta-click__body t-p"><p>${esc(p.body)}</p></div>
      </div>
      <div class="cta-click__buttons">${p.href ? `<div class="btn btn--orange"><span class="t-mono-s">${esc(p.button || 'JOIN NOW')}</span>${arrow('#fff')}</div>` : `<button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">${esc(p.button || 'JOIN NOW')}</span>${arrow('#fff')}</button>`}</div>
    </header>
  </${p.href ? 'a' : 'section'}>`,
};
