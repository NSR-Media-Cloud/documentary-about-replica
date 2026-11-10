'use strict';
// Block registry: every CMS-style component the pages can use, keyed "block" or "block:variant".
// Each entry is { render(props) → html, css?: ['name', …]  (files in css/blocks/) }.
const registry = Object.assign(
  {
    placeholder: { render: (p) => `  <section class="padding" style="min-height:100svh;padding-top:30rem"><p class="t-m">${p.text}</p></section>` },
  },
  require('./about.cjs'),
  require('./notfound.cjs'),
  require('./accordion.cjs'),
  require('./legal.cjs'),
  require('./textimage.cjs'),
  require('./contactform.cjs'),
  require('./courses.cjs'),
  require('./course.cjs'),
  require('./cta.cjs'),
  require('./textmedia.cjs'),
  require('./addon.cjs'),
  require('./certification.cjs'),
  require('./funding.cjs'),
  require('./enterprise.cjs'),
  require('./competition.cjs'),
  require('./shortcourse.cjs'),
  require('./home.cjs'),
);

module.exports = registry;
