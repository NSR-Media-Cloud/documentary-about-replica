'use strict';
// "/" — the home page: 15 blocks. Stand-in copy throughout: the people, quotes, figures and logos are invented samples.
const courses = require('../data/courses.cjs');
const { COMMON } = require('../data/course-pages.cjs');
const { logo } = require('../data/brand.cjs');
const funding = require('./funding.cjs');

const img = (n) => `/assets/img/${n}.jpg`;
const by = (slug) => courses.find((c) => c.slug === slug);
const CONTAINS = {
  'nonfiction-foundations': ['No big budget needed', 'Finish your first film', 'Share it with an audience', 'Use the gear you own'],
  'advanced-storytelling': ['Shape your breakthrough film', 'Build your team', 'Work with a larger budget', 'Find your voice'],
  'make-and-sell': ['Build a video business model', 'Land long-term clients', 'Price your jobs', 'Make money on YouTube'],
  'the-final-cut': ['Stay organised from day one', 'A fast, efficient editing system', 'From ingest to delivery'],
  'the-roving-eye': ['Elevate your cinematography', 'Lighting from basic to advanced', 'Shoot with confidence in any kind of location', 'Master colour grading'],
  'field-notes-pro': ['Become a top-tier camera op', 'Advanced camera techniques', 'Brand and market yourself'],
  'producing-essentials': ['Budget templates', 'Pitch like a pro', 'Deliver on budget, on time'],
};
// logo-box heights measured on the source (desktop px, phone rem): they set each card's natural height
const LOGO_H = { 'nonfiction-foundations': [40, 37.5], 'advanced-storytelling': [30, 28.8], 'make-and-sell': [56, 52.9], 'the-final-cut': [44, 41.3], 'the-roving-eye': [49, 47.1], 'field-notes-pro': [44, 42.3], 'producing-essentials': [61, 57.7] };
const card = (slug) => {
  const c = by(slug);
  return { ...c, lh: LOGO_H[slug][0], lhm: LOGO_H[slug][1], contains: CONTAINS[slug], box: { image: img(c.img), lines: c.logo.lines, fine: 'Video lessons · guides · community' } };
};
const results = Object.fromEntries(courses.map((c) => [c.slug, { slug: c.slug, title: c.title, cost: c.cost, line: c.overview }]));
const films = funding.blocks.find((b) => b.block === 'filmGrid').films;

module.exports = {
  path: '/',
  title: '',
  description: 'Practical documentary teaching, taught by makers',
  active: '/',
  blocks: [
    { block: 'hero:fullBleedCentered', tag: 'The Reel Truth Academy', heading: 'Ready to make your first real film?', image: img('hero-5') },
    {
      block: 'glideTrack',
      heading: 'RTA is here to help you make <span style="color:#FFA200">honest films.</span>',
      groups: [
        { title: 'Even if you...', items: ['have never held a camera', 'can’t afford much gear', 'only have weekends free'] },
        { title: 'We’ll help you...', items: ['find a story close to home', 'shoot it with what you own', 'get it in front of an audience'] },
      ],
    },
    {
      block: 'stats', heading: 'Over 3000 filmmakers have moved their careers forward with RTA',
      items: [['Completed docs', '+1200'], ['In new client contracts', '$Millions'], ['Laurels + festival selections', '+640']],
    },
    {
      block: 'quoteFrame',
      quotes: [
        { name: 'Maren Voss', image: 'hero-2', imageSm: 'founder-1-sm', text: '“Our short film passed a million views online and has just been nominated for a regional screen award.”' },
        { name: 'Ilan Cruz', image: 'hero-3', imageSm: 'founder-2-sm', text: '“I finished my first documentary and premiered it at our local mountain film festival.”' },
        { name: 'Priya Nandakumar', image: 'founder-1-lg', imageSm: 'hero-1', text: '“I just landed my first paid shoots with two national brands and a documentary series, all from skills I learned here.”' },
        { name: 'Tomas Okafor', image: 'founder-2-lg', imageSm: 'hero-4', text: '“We just had the privilege of winning an award for our documentary, and none of it would have happened without the feedback and the community around me.”' },
      ],
    },
    {
      block: 'homeCourses',
      heading: 'Unlock new career possibilities with <span style="color:#FFA200">our courses</span> today',
      groups: [
        { title: 'Directing', courses: ['nonfiction-foundations', 'advanced-storytelling', 'make-and-sell'].map(card) },
        { title: 'Craft', courses: ['the-final-cut', 'the-roving-eye'].map(card) },
        { title: 'Business', courses: ['field-notes-pro', 'producing-essentials'].map(card) },
      ],
    },
    {
      block: 'courseQuiz', heading: 'Which course is right for you?', quizLabel: 'Take the Filmmaker Quiz', pricingLabel: 'Pricing Options',
      image: img('hero-3'), videoTitle: 'Welcome to the Reel Truth Academy', videoLabel: 'Watch this video', results,
    },
    { block: 'pricingCards', ...COMMON.pricing, heading: '', body: '', cost: 529 },
    {
      block: 'iconTextBlocks', heading: ['What’s included', 'when you join RTA'], image: 'hero-1',
      blocks: [
        { icon: 'teach', title: 'Guided, in-depth lessons', body: 'Work through a full library of short, practical lessons, each one built around a real film, so you always know what to do next whether you are planning, shooting or editing.' },
        { icon: 'clock', title: 'Learn on your schedule', body: 'Every lesson, worksheet and template is available whenever you want it, on any device. Pause for a month, come back, and pick up exactly where you left off with nothing expiring.' },
        { icon: 'call', title: 'Live monthly calls', body: 'Once a month a working producer, editor or cinematographer joins a live session and takes your questions. Every call is recorded, so you can catch up if the time does not suit you.' },
        { icon: 'people', title: 'Interactive community', body: 'A private group of makers at every level, where you can share a rough cut, ask for a second pair of eyes, find a collaborator or simply see how other people solve the same problems.' },
        { icon: 'doc', title: 'Assignments and certificates', body: 'Short practical assignments turn what you watch into footage you can use. Finish a course and its final project and you receive a certificate that you can share with anyone who asks.' },
        { icon: 'chat', title: 'Personal coaching and rough-cut notes', body: 'Send us a work in progress and get written notes from a working filmmaker, so the changes you make next are the ones that matter most to your film.' },
      ],
    },
    { block: 'ctaMedia', title: 'Teams our members work with', image: 'hero-4', imageSm: 'hero-1' },
    {
      block: 'testimonialCards', heading: 'A school and a community to grow your craft',
      cards: [
        { image: 'founder-2-sm', heading: 'Mara’s story:', author: '– Mara', quote: '“With RTA I went from barely any experience in the industry to working <em>FULL TIME</em> with a documentary production company, in under a year.”' },
        { image: 'founder-1-sm', heading: 'Idris’s story:', author: '– Idris', quote: '“I went from videographer to <em>storyteller</em> and <em>filmmaker</em> with RTA. I’ve learned how to make more money and separate myself from other videographers.”' },
      ],
    },
    { block: 'pricingCards', ...COMMON.pricing, cost: 529 },
    { block: 'videoSlider', heading: 'Our members’ success speaks for itself', names: COMMON.names },
    {
      block: 'pricingTable',
      columns: [{ name: 'RTA', logo: `<path d="${logo.d}" fill="#fff"/>` }, { name: 'Film School' }, { name: 'Other Courses' }],
      rows: [
        { label: 'Lifetime access to lessons', has: [true, false, true] },
        { label: 'Monthly curriculum updates', has: [true, false, true] },
        { label: 'On-demand video library you keep', has: [true, false, true] },
        { label: 'Learn at your own pace', has: [true, false, true] },
        { label: 'Direct access to industry guests', has: [true, true, false] },
        { label: 'Contests and awards', has: [true, true, false] },
        { label: 'Live feedback sessions', has: [true, true, false] },
        { label: 'Lifetime community and network', has: [true, false, false] },
        { label: 'Funding for member meet-ups', has: [true, false, false] },
        { label: 'Festival, funding and distribution support', has: [true, false, false] },
      ],
    },
    { block: 'filmGrid', mobileLimit: 3, heading: 'Our members’ films are winning awards and securing distribution deals', films },
    { block: 'pricingCards', ...COMMON.pricing, heading: 'Everything you need to take a film from first idea to finished screening and beyond', cost: 529 },
  ],
};
