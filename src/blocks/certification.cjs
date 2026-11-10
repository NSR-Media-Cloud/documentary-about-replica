'use strict';
// Certification page blocks: stepsStack (numbered steps through a pinned frame) and certificates (badges + list).
const { esc, pic } = require('../util.cjs');

const pad = (n) => String(n).padStart(2, '0');

exports.stepsStack = {
  css: ['certification'],
  render: (p) => `  <section class="steps padding">
    <header><h2 class="t-mono orange">${esc(p.tag)}</h2><h3 class="t-m">${esc(p.heading)}</h3></header>
    <div class="steps__wrap">
      <div>
${p.steps.map((t, i) => `        <div class="steps__block"><div class="t-xl">${pad(i + 1)}</div><p class="t-p">${esc(t)}</p></div>`).join('\n')}
      </div>
      <div class="steps__sticky" aria-hidden="true"><div class="steps__corners corners"></div></div>
    </div>
  </section>`,
};

exports.certificates = {
  css: ['certification'],
  render: (p) => `  <section class="certs padding">
    <header><h2 class="t-mono orange">${esc(p.tag)}</h2><h3 class="t-m">${esc(p.heading)}</h3></header>
    <div class="certs__badges">${p.badges.map((b) => pic({ src: `/assets/svg/badges/${b}.svg`, w: 376, h: 376 })).join('')}</div>
    <ul class="certs__list">
${p.items.map((c, i) => `      <li class="certs__item">
        <div class="certs__index t-mono-s">Certificate ${pad(i + 1)}</div>
        <div class="certs__heading"><span class="t-mono-s">Completion of</span><h4 class="t-s">${esc(c.title)}</h4></div>
        <div class="certs__requirements t-mono-s"><span>Requirements</span><ul>${c.requirements.map((r) => `<li><span>${esc(r)}</span></li>`).join('')}</ul></div>
      </li>`).join('\n')}
    </ul>
  </section>`,
};
