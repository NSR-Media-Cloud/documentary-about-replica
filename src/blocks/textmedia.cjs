'use strict';
// "Why join" text-and-media cards (textMediaCards).
const { esc, pic } = require('../util.cjs');

exports.textMediaCards = {
  css: ['text-media-cards', 'course-hero', 'courses', 'accordion', 'course-blocks', 'contactform', 'cta-click'],
  render: (p) => `  <section class="tmc padding">
    <header><h2 class="t-m"><span style="display:block">${esc(p.heading)}</span></h2></header>
    <div class="tmc__cards">
      <div class="tmc__viewport" tabindex="0" role="group" aria-label="Cards"><div class="tmc__track">
${p.cards.map((c) => `        <div class="tmc__slide"><div class="tmc__card">
          <div class="tmc__info"><h3 class="t-xs"><span style="display:block">${esc(c.title)}</span></h3><div class="tmc__body t-p"><p>${esc(c.body)}</p></div></div>
          <div class="tmc__media">${pic({ src: `/assets/img/${c.image}.jpg`, w: 1792, h: 2240 })}</div>
        </div></div>`).join('\n')}
      </div></div>
      <div class="tmc__progress" aria-hidden="true"></div>
    </div>
  </section>`,
};
