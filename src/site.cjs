'use strict';
// Site-wide data shared by the shell (nav, menu, footer) and the pages.

exports.NAME = 'The Reel Truth Academy';
exports.SHORT = 'Reel Truth Academy';

/** Main navigation, in menu order: [label, href]. */
exports.pages = [
  ['Home', '/'],
  ['Courses', '/courses'],
  ['Certification', '/certification'],
  ['Funding', '/funding'],
  ['Competition', '/short-documentary-competition'],
  ['Enterprise', '/enterprise'],
  ['About', '/about'],
  ['FAQ', '/frequently-asked-questions'],
  ['Contact', '/contact'],
];

/** Courses in menu order. `img` is the cover number, `pill` shows the NEW pill, `ribbon` is the cover ribbon. */
exports.courses = [
  { slug: 'nonfiction-foundations', title: 'Nonfiction Foundations', img: 1 },
  { slug: 'advanced-storytelling', title: 'Advanced Storytelling', img: 2 },
  { slug: 'make-and-sell', title: 'Make & Sell', img: 3 },
  { slug: 'the-final-cut', title: 'The Final Cut', img: 4 },
  { slug: 'the-roving-eye', title: 'The Roving Eye', img: 5, ribbon: 'New course' },
  { slug: 'field-notes-pro', title: 'Field Notes Pro', img: 6, pill: true, ribbon: 'New Course' },
  { slug: 'producing-essentials', title: 'Producing Essentials', img: 7, pill: true },
];

exports.socials = [
  ['YouTube', 'https://www.youtube.com/'],
  ['Instagram', 'https://www.instagram.com/'],
];

exports.legals = [
  ['Privacy Policy', '/legals/privacy-policy'],
  ['Terms of Use', '/legals/terms-of-use'],
];

/** Scripts every page loads. */
exports.vendor = ['gsap.min.js', 'ScrollTrigger.min.js', 'CustomEase.min.js', 'lenis.min.js'];
