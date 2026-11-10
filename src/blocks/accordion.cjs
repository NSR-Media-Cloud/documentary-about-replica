'use strict';
// Accordion — FAQ variant ("default"): numbered question rows that slide open one at a time.
const { esc, arrow } = require('../util.cjs');

const BRACKETS = `<div class="accordion__brackets t-mono-s"><div>[</div><svg fill="none" height="14" viewBox="0 0 8 14" width="8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="#fff"><path d="m7.5 6v1h-7v-1z"/><path d="m3.5 3h1v7h-1z"/></g></svg><div>]</div></div>`;

const tab = (it, i, id) => `      <li class="accordion__tab">
        <button class="accordion__button" type="button" aria-expanded="false" aria-controls="${id}-${i}">
          <div class="accordion__index t-mono-s">[ ${String(i + 1).padStart(2, '0')} ]</div>
          <span class="accordion__heading t-p">${esc(it.q)}</span>
          <div class="accordion__view t-mono-s"><div class="accordion__view-text desktop">View Less</div>${BRACKETS}</div>
        </button>
        <div class="accordion__panel" id="${id}-${i}" aria-hidden="true" inert>
          <div class="accordion__tab-body"><div class="accordion__body-wrap"><div class="accordion__body t-sp"><p>${esc(it.a)}</p></div></div></div>
        </div>
      </li>`;

exports['accordion:default'] = {
  css: ['accordion'],
  render: (p) => `  <section class="accordion padding" id="faq">
    <header class="accordion__header">
      <h2 class="accordion__tag t-mono orange">${esc(p.tag)}</h2>
      <div class="accordion__lead">
        <h3 class="accordion__title t-m">${[].concat(p.heading).map((l) => `<span style="display:block">${esc(l)}</span>`).join('')}</h3>
        <div class="accordion__buttons">${p.primaryButton ? `<button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">${esc(p.primaryButton)}</span>${arrow('#fff')}</button>` : ''}</div>
      </div>
    </header>
    <ol class="accordion__list">
${p.items.map((it, i) => tab(it, i, 'faq')).join('\n')}
    </ol>
  </section>`,
};
