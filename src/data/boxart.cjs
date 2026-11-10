'use strict';
// The CSS-drawn product box (see css/blocks/short-course.css), shared by the short course page and the home course cards.
const { esc } = require('../util.cjs');
const { logo } = require('./brand.cjs');

/** @param {{image:string, lines:string[], fine:string}} b */
exports.boxArt = (b) => `<div class="boxart" aria-hidden="true">
            <div class="boxart__spine"></div>
            <div class="boxart__face">
              <img class="boxart__img" src="${b.image}" alt="" width="568" height="785" loading="lazy" decoding="async">
              <div class="boxart__shade"></div>
              <svg class="boxart__logo" viewBox="0 0 ${logo.w} ${logo.h}" fill="currentColor"><path d="${logo.d}"/></svg>
              <div class="boxart__title">${b.lines.map(esc).join('<br>')}<sup>™</sup></div>
              <div class="boxart__marks"><i></i><i></i><i></i><i></i></div>
              <div class="boxart__fine">${esc(b.fine)}</div>
            </div>
          </div>`;
