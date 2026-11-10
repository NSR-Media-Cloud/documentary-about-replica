'use strict';
// /modules/<slug> — the three add-on modules (stand-in names and copy).
const courses = require('../data/courses.cjs');
const { SPEC, COMMON } = require('../data/course-pages.cjs');

const BANK = [
  'A step-by-step system for building a daily practice', 'Weekly and yearly rhythms that protect your focus', 'Tools to find and sharpen your creative voice',
  'Ways to cut distraction from your working day', 'A golden-hour routine for your sharpest ideas', 'Templates for planning shoots without burnout',
  'A review ritual that turns every project into growth', 'Prompts for the days when nothing seems to work', 'How to keep a notebook that actually feeds your films',
  'Checklists that make the start of a project calmer', 'Habits for sharing work early and taking notes well', 'A simple scorecard for choosing what to make next',
];
const items = (seed, n) => Array.from({ length: n }, (_, i) => BANK[(seed + i * 5) % BANK.length]);

const MODULES = [
  {
    slug: 'craft-lab', name: "Craft Lab", price: "$299", format: "Online", image: "hero-3",
    description: "Build the habits, systems and creative stamina to make your best work.",
    sections: [{"title":"The Daily Habits Behind Great Filmwork","items":["A step-by-step system for building a daily practice","Weekly and yearly rhythms that protect your focus time","Tools to find and sharpen your own creative voice","Ways to cut the distractions out of your working day","A golden-hour routine for your sharpest ideas","Templates for planning shoots without ever burning out","A review ritual that turns each project into growth"]},{"title":"Everyday Practice","items":["Daily pages","Weekly shot log","Journal","Mood boards","Sketch","Reference reel","Peer review swap sessions","Quarterly retreat","Rough cut day","Walk notes","Silent hours","Finish-line list"]}],
  },
  {
    slug: 'maker-toolkit', name: "Maker Toolkit", price: "$149", format: "Downloadable", image: "hero-5",
    description: "A working producer’s folder of templates, forms and checklists, ready to adapt today.",
    sections: [{"title":"Toolkit Contents","items":["Budget, schedule and call sheet templates from working producers, ready to adapt to any film","Release and location forms written in plain, genuinely usable words","Shot list, coverage and sound checklists you can print, pin up and tick off on any shoot","Pitch deck base files","Delivery tracker"]}],
  },
  {
    slug: 'guest-sessions', name: "Guest Sessions", price: "$199", format: "Online", image: "hero-6",
    description: "Live sessions with working producers, editors and commissioners, recorded for you to keep. Ask them anything you like.",
    sections: [{"title":"Sessions Breakdown","items":["A monthly live call with a working producer, recorded for members who cannot be there on the day","A recorded masterclass with a broadcast editor","A commissioner Q&A on what a documentary pitch really needs to earn a confident yes"]},{"title":"Guest Roster","items":["A producer who raises funding for independent features","A feature editor who has cut for broadcasters and streamers","A cinematographer known for patient, observational shooting","A sound recordist who captures clean dialogue in any location","A commissioning editor who explains how decisions really get made inside a broadcaster, and how to prepare"]}],
  },
];

module.exports = MODULES.map((m) => ({
  path: `/modules/${m.slug}`, title: m.name, description: m.description, active: '', bodyClass: 'course-page',
  blocks: [
    { block: 'addOnHero', ...m },
    { block: 'courseBody', blocks: [
      { block: 'sessionsBreakdown', tag: 'What’s Included', sections: m.sections },
      { block: 'courseCardStack', heading: COMMON.stackHeading, courses: courses.map((o) => ({ ...o, hours: SPEC[o.slug] ? SPEC[o.slug].hours : '18 Hours', videos: SPEC[o.slug] ? SPEC[o.slug].videos : '55 Videos' })) },
      { block: 'contactForm', heading: "Questions about this module, or about which one fits where you are right now? Our team is here to help you decide well.", topics: ['General Inquiry', 'Course Inquiry', 'Team Inquiry'] },
    ] },
  ],
}));
