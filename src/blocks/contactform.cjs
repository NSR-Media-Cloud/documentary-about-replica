'use strict';
// Contact form section: heading + links on the left, the form on the right, a small photo underneath.
const { esc, pic, arrow } = require('../util.cjs');
const countries = require('../data/countries.cjs');

const line = '<div class="form__line-wrap"><div class="form__line"></div></div>';
const field = (id, label, extra = '') => `        <div class="form__field t-sp">
          <input class="form__input" id="${id}" name="${id}" ${extra} placeholder=" ">
          <label class="form__label" for="${id}">${label}</label>
          ${line}
        </div>`;

const phone = () => `        <div class="form__field phone t-sp">
          <div class="phone__selector" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="false" aria-controls="country-list" aria-label="Country code"><img class="phone__flag" src="/assets/flags/us.svg" alt="" width="16" height="16"><svg width="8" height="4" viewBox="0 0 8 4" fill="#fff" aria-hidden="true"><path d="M4 4L8 0H0L4 4Z"/></svg></div>
          <div class="phone__code">+<span>1</span></div>
          <input class="form__input" id="phone" name="phone" type="tel" autocomplete="tel-national" placeholder=" ">
          <label class="form__label" for="phone">Phone Number</label>
          ${line}
          <ul class="phone__list" id="country-list" role="listbox" aria-label="List of countries" data-lenis-prevent>
${countries.map(([name, iso, dial]) => `            <li class="phone__country t-sp" role="option" id="country-${iso}" data-iso="${iso}" data-dial="${dial}"><img class="phone__flag" src="/assets/flags/${iso}.svg" alt="" width="16" height="16" loading="lazy"><span>${esc(name)}</span><span>+${dial}</span></li>`).join('\n')}
          </ul>
        </div>`;

const topics = (list) => `        <div class="form__field multiselect">
          <div class="multiselect__select">
            <div class="multiselect__inputs">
              <div class="multiselect__selected t-sp" hidden></div>
              <input class="multiselect__input form__input t-sp" id="topics" type="text" role="combobox" aria-expanded="false" aria-controls="topics-list" autocomplete="off" readonly placeholder=" ">
              <label class="form__label" for="topics">Topics</label>
              <div class="multiselect__buttons"><button class="multiselect__arrow" type="button" aria-label="Show topics" tabindex="-1"><svg width="8" height="4" viewBox="0 0 8 4" fill="currentColor" aria-hidden="true"><path d="M4 4L8 0H0L4 4Z"/></svg></button></div>
            </div>
            <ul class="multiselect__dropdown" id="topics-list" role="listbox" aria-multiselectable="true">
${list.map((t) => `              <li class="multiselect__item t-sp" role="option" tabindex="0" data-value="${esc(t)}">${esc(t)}</li>`).join('\n')}
            </ul>
            <select class="multiselect__hidden" name="topics" multiple tabindex="-1" aria-hidden="true">${list.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join('')}</select>
          </div>
          ${line}
        </div>`;

const form = (p) => `      <form class="form" id="contact-form-el" novalidate>
        <div class="form__grid">
${field('firstName', 'First Name', 'type="text" autocomplete="given-name" required')}
${field('lastName', 'Last Name', 'type="text" autocomplete="family-name" required')}
${field('email', 'Email Address', 'type="email" autocomplete="email" required')}
${phone()}
${topics(p.topics)}
        <div class="form__field t-sp">
          <textarea class="form__input" id="message" name="message" rows="5" placeholder=" " required></textarea>
          <label class="form__label" for="message">Message</label>
          ${line}
        </div>
        <div class="form__honey" aria-hidden="true"><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <div class="form__field form__submission">
          <div class="form__fail t-sp" role="alert">There were some errors in your submission.<br>Please try filling in the form again.</div>
          <div class="form__submit-wrap"><button class="btn btn--orange" type="submit"><span class="t-mono-s">Submit</span>${arrow('#fff')}</button></div>
        </div>
        </div>
        <div class="form__success t-p" role="status">
          <div>Thanks for getting in touch.<br>We’ll reply within two working days.</div>
          <button class="btn btn--dark" type="button" data-form-reset><span class="t-mono-s">Send another message</span>${arrow('#fff')}</button>
        </div>
      </form>`;

exports.contactForm = {
  css: ['contactform'],
  render: (p) => `  <section class="contact-form padding${p.center ? ' contact-form--center' : ''}" id="contact-form">
    <h2 class="contact-form__tag t-mono orange"${p.tag ? '' : ' aria-hidden="true"'}>${esc(p.tag || '')}</h2>
    <div class="contact-form__inner${p.image ? ' contact-form__inner--margin' : ''}">
      <header>
        <h3 class="${p.center ? 't-m' : 't-s'}">${esc(p.heading)}</h3>
${p.links ? `        <ul class="contact-form__social-links">
${p.links.map(([label, href]) => `          <li><a class="t-mono-s t-link" href="${href}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}>${label}</a></li>`).join('\n')}
        </ul>` : ''}
      </header>
${form(p)}
    </div>
${p.image ? `    ${pic({ src: p.image, w: 784, h: 832, cls: 'contact-form__image' })}` : ''}
  </section>`,
};
