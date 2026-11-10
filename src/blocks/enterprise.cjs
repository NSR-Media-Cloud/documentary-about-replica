'use strict';
// Enterprise page blocks: logoMarquee (endless strip of made-up organisation marks), textMediaStack (three sticky cards,
// each with a live stand-in "screen recording") and centeredText (the small print under the stack).
const { esc } = require('../util.cjs');
const { LOGOS, logoHtml } = require('../data/logos.cjs');

const pad = (n) => String(n).padStart(2, '0');

exports.logoMarquee = {
  css: ['enterprise'],
  render: (p) => `  <section class="logo-marquee">
    <header><h2 class="t-mono orange">${esc(p.tag)}</h2></header>
    <div class="logo-marquee__slider" style="--n:${LOGOS.length}">
      <div class="logo-marquee__track">
${[...LOGOS, ...LOGOS].map((l, i) => `        <div class="logo-marquee__slide">${logoHtml(l, i >= LOGOS.length)}</div>`).join('\n')}
      </div>
    </div>
  </section>`,
};

// ---- stand-in "screen recordings" (the source shows three short looping videos; this study ships no footage)
const SEATS = ['MK', 'AO', 'JT', 'LS', 'RB', 'DV', 'CN'];
const demos = {
  seats: () => `<div class="demo demo--seats" data-demo="seats" aria-hidden="true">
            <div class="demo__count"><span class="demo__num" data-num>5</span><span class="demo__unit">User</span></div>
            <div class="demo__line"><i data-fill></i></div>
            <div class="demo__people">${SEATS.map((s, i) => `<span class="demo__slot${i < 5 ? ' is-filled' : ''}" style="--tone:${i}"><span class="demo__plus">+</span><span class="demo__ini">${s}</span></span>`).join('')}</div>
            <div class="demo__line demo__line--thin"><i class="demo__accent"></i></div>
            <div class="demo__save"><span>Saving</span><b data-save>$2010</b></div>
          </div>`,
  progress: () => `<div class="demo demo--progress" data-demo="progress" aria-hidden="true">
${[0, 1, 2].map((i) => `            <div class="demo__row${i === 2 ? ' is-accent' : ''}"><span class="demo__label">Course<br>${pad(i + 1)}</span><div class="demo__track"><div class="demo__bar"></div><b class="demo__pct">0%</b></div></div>`).join('\n')}
          </div>`,
  benefits: (items) => `<div class="demo demo--benefits" data-demo="benefits" data-words="${esc(items.join('|'))}" aria-hidden="true">
            <i class="demo__ring demo__ring--1"></i><i class="demo__ring demo__ring--2"></i><i class="demo__ring demo__ring--3"></i>
            <div class="demo__core"><span class="demo__kicker">Benefits</span><span class="demo__word" data-word>${esc(items[0])}</span><span class="demo__kicker">Included</span></div>
          </div>`,
};

exports.textMediaStack = {
  css: ['enterprise'],
  render: (p) => `  <section class="tms padding">
    <header><h2 class="t-m">${esc(p.heading)}</h2></header>
    <div class="tms__stack">
${p.sections.map((s, i) => `      <div class="tms__card">
        <div class="tms__inner">
          <div class="tms__header"><h3 class="t-s">${esc(s.heading)}</h3><div class="tms__body t-sp"><p>${esc(s.body)}</p></div></div>
          <div class="t-mono-s">${i + 1} / ${p.sections.length}</div>
        </div>
        <div class="tms__vline"></div>
        <div class="tms__video">
          ${demos[s.demo](s.items)}
        </div>
      </div>`).join('\n')}
    </div>
  </section>`,
};

exports.centeredText = {
  css: ['enterprise'],
  render: (p) => `  <section class="centered-text padding t-p"><p>${esc(p.text)}</p></section>`,
};
