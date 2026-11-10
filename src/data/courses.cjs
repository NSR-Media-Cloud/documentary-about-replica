'use strict';
// The academy's courses (stand-in names, copy and prices). Order = menu order = listing order.
//   logo: lines of the typographic "logo" (rendered as styled text) + a style variant
//   img : photo used on the listing cards (assets/img/<img>.jpg)
const base = ['Savings On Gear & Software', 'Private Community Group', 'Access To Industry Job Postings'];

module.exports = [
  {
    slug: 'nonfiction-foundations', n: 1, title: 'Nonfiction Foundations', cost: 529, img: 'hero-2',
    logo: { style: 'stack', lines: ['Nonfiction', 'Foundations'] },
    overview: 'Learn the full loop: find a story, shoot it, cut it and put it in front of a real live audience.',
    included: ['60+ Videos', 'Monthly Guest Sessions', ...base].filter((t, i) => i !== 3 || true),
  },
  {
    slug: 'advanced-storytelling', n: 2, title: 'Advanced Storytelling', cost: 779, img: 'hero-3',
    logo: { style: 'light', lines: ['Advanced Storytelling'] },
    overview: 'Go deeper into structure, voice and edit so your films can hold a room.',
    included: ['60+ Videos', 'Monthly Guest Sessions', 'Savings On Gear & Software', 'Private Community Group', 'Bi-Weekly Feedback Calls', 'Access To Industry Job Postings'],
  },
  {
    slug: 'make-and-sell', n: 3, title: 'Make & Sell', cost: 679, img: 'hero-6',
    logo: { style: 'heavy', lines: ['Make & Sell'] },
    overview: 'Everything you need to build a steady, profitable career behind a lens.',
    included: ['60+ Videos', 'Monthly Guest Sessions', ...base],
  },
  {
    slug: 'the-final-cut', n: 4, title: 'The Final Cut', cost: 679, img: 'hero-5',
    logo: { style: 'wide', lines: ['The Final Cut'] },
    overview: 'A practical guide to fast, clean and gripping documentary cuts.',
    included: ['50+ Videos', 'Monthly Guest Sessions', ...base],
  },
  {
    slug: 'the-roving-eye', n: 5, title: 'The Roving Eye', cost: 779, img: 'founder-1-lg', ribbon: 'New course',
    logo: { style: 'heavy', lines: ['The Roving Eye'] },
    overview: 'The craft of shooting vivid, honest pictures that carry a whole story.',
    included: ['80 Videos', 'Monthly Guest Sessions', ...base],
  },
  {
    slug: 'field-notes-pro', n: 6, title: 'Field Notes Pro', cost: 779, img: 'founder-2-lg', isNew: true, ribbon: 'New Course',
    logo: { style: 'mix', lines: ['Field Notes', 'PRO'] },
    overview: 'Your route to becoming a trusted documentary cameraperson on set.',
    included: ['55+ Videos', 'Monthly Guest Sessions', '8 Feedback Sessions With A Mentor', 'Savings On Gear & Software', 'Cash Prize Contests', 'Private Community Group', 'Access To Industry Job Postings'],
  },
  {
    slug: 'producing-essentials', n: 7, title: 'Producing Essentials', cost: 679, img: 'hero-1', isNew: true, ribbon: 'New Course',
    logo: { style: 'stack-light', lines: ['Producing', 'Essentials'] },
    overview: 'From budget to delivery: fund, schedule and manage a documentary so that it lands on time and on budget.',
    included: ['45+ Videos', 'Monthly Guest Sessions', '3 Two-Hour Workshops', 'Savings On Gear & Software', 'Cash Prize Contests', 'Private Community Group', 'Access To Industry Job Postings'],
  },
];
