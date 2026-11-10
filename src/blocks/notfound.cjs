'use strict';
const { pic } = require('../util.cjs');

exports.notFound = {
  css: ['notfound'],
  render: (p) => `  <section class="notfound">
    <div class="notfound__square corners">
      <span class="t-xl">404</span>
      <span class="t-xsp">Error - Page Not Found</span>
      <a class="btn btn--orange notfound__button" href="/"><span class="t-mono-s">Back to home</span></a>
    </div>
    ${pic({ src: p.image, w: 1792, h: 1008, lazy: false, priority: true, cls: 'notfound__image' })}
  </section>`,
};
