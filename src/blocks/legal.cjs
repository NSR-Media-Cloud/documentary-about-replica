'use strict';
// Legal text page: sticky "Sections" list + long-form content. Section 0 is the intro (listed in the menu, no heading).
const { esc } = require('../util.cjs');

exports.legal = {
  css: ['legal'],
  render: (p, page) => `  <section class="legal">
    <div class="legal__header">
      <div class="legal__sections-heading t-mono orange">Sections</div>
      <ul class="legal__links" data-lenis-prevent>
${p.sections.map((s) => `        <li id="link-${s.id}"><a class="t-sp legal__link" href="${page.path}#${s.id}">${esc(s.title)}</a></li>`).join('\n')}
      </ul>
    </div>
    <div class="legal__content">
      <h1 class="t-l">${esc(p.heading)}</h1>
${p.sections.map((s, i) => `      <div class="legal__block" id="${s.id}">
${i ? `        <h2 class="t-xs">${esc(s.title)}</h2>\n` : ''}        <div class="t-p">${s.html}</div>
      </div>`).join('\n')}
    </div>
  </section>`,
};
