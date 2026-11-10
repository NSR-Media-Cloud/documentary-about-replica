'use strict';
// Detail-page content for each course (stand-in copy). Chapter / lesson counts follow the structure of the source pages
// so section heights match; every title below is original to this project.
const courses = require('./courses.cjs');

const BANK = [
  'What Makes A Story Worth Telling', 'Choosing A Subject', 'Finding Access', 'Research That Pays Off', 'Writing A One-Page Pitch', 'Building A Treatment',
  'Where The Money Comes From', 'Grants, Pitches And Sponsors', 'Budgeting In Plain English', 'Assembling A Small Crew', 'Releases And Permissions', 'Planning A Shoot Day',
  'Choosing A Camera', 'Lenses For Real Locations', 'Lighting With Almost Nothing', 'Recording Clean Sound', 'Running An Interview', 'Shooting B-Roll That Cuts',
  'Working With Natural Light', 'Handheld, Gimbal Or Tripod', 'Managing Footage On Set', 'Organising Your Project', 'Building A Rough Cut', 'Finding The Structure',
  'Cutting Interviews', 'Pacing And Rhythm', 'Using Archive And Stills', 'Music And Silence', 'Mixing Dialogue', 'Grading For Mood', 'Titles And Graphics', 'Picture Lock',
  'Delivery Specs', 'Festival Strategy', 'Press Kits And Posters', 'Selling To Platforms', 'Pricing Your Services', 'Finding Your First Clients', 'Reading A Contract',
  'Building A Showreel', 'Working With A Producer', 'Feedback Without Panic', 'Keeping A Project Alive', 'Next Steps',
];
const DUR = ['7:10', '9:40', '11:48', '3:44', '9:13', '7:18', '8:02', '10:27', '5:31', '12:05', '6:46', '4:58'];
const lessons = (seed, n) => Array.from({ length: n }, (_, i) => [BANK[(seed * 7 + i * 3) % BANK.length], DUR[(seed + i * 5) % DUR.length]]);

/** Per-course data. `cards` = chapter cards, `lessons` = lessons per list row (one more row than cards when `extra` is set). */
const SPEC = {
  'nonfiction-foundations': {
    cards: ['Finding A Story', 'Funding Your Film', 'Pre-Production', 'Gear For Production', 'Shooting & Sound', 'Editing', 'Sound & Colour', 'Finishing Your Film', 'Bonus Videos'],
    extra: 'Next Steps', lessons: [11, 3, 8, 4, 9, 10, 12, 3, 4, 2], hours: '15 Hours', videos: '60 Videos',
    quote: ['“This course took me from a loose idea to a finished short, and I never felt lost on the way.”', 'Dana R.'],
    breakdownHeading: 'Learn the whole loop: find a story, shoot it, cut it, and then put it in front of a real live audience.',
    hero: 'hero-2', thumb: 'small-1', blocks: ['quote', 'videoSlider', 'stats', 'social', 'pricing', 'stack', 'contact'],
  },
  'advanced-storytelling': {
    cards: ['The Shape Of A Film', 'Voice And Point Of View', 'Scenes That Move', 'Interviews That Open Up', 'Archive And Evidence', 'The Long Edit', 'Rhythm, Structure And The Shape Of Time', 'Sound As Story', 'Music Choices', 'Finishing For Festivals And Platforms'],
    extra: 'Bonus Lessons', lessons: [3, 9, 8, 5, 9, 6, 2, 7, 3, 4, 2], hours: '21 Hours', videos: '68 Videos',
    quote: ['“I arrived knowing how to cut a scene and left knowing how to build a complete film. The notes on my rough cut alone were worth the price of the entire course.”', 'Jonas K.'],
    cardRatio: { 3: 1.499 }, statsHeading: 'Build the craft and the confidence to take a film from a single idea to a finished public screening',
    hero: 'hero-3', thumb: 'small-2', blocks: ['quote', 'videoSlider', 'stats', 'social', 'pricing', 'stack', 'contact'],
  },
  'make-and-sell': {
    cards: ['Finding Your Niche', 'Packages And Pricing', 'Finding Clients', 'Pitching And Proposals', 'Producing For Clients', 'Delivery, Contracts And Usage Rights', 'Growing A Studio That Outlasts One Project'],
    extra: 'Next Steps', lessons: [3, 10, 6, 12, 5, 6, 6, 3], hours: '19 Hours', videos: '64 Videos',
    quote: ['“I booked my first paid commission within a month.”', 'Priya N.'],
    breakdownHeading: 'All you need to build a steady, profitable career behind a lens.',
    noQuote: true,
    cta: { image: 'hero-4', drops: ['hero-1', 'hero-5', 'founder-2-lg', 'hero-3'], heading: 'Ready to stop waiting and start landing real paid film work?', body: 'This course gives you the tools, templates and nerve to start booking clients.' }, statsHeading: 'Build the craft and the confidence to take a film from a single idea to a finished public screening',
    hero: 'hero-6', thumb: 'small-1', blocks: ['quote', 'videoSlider', 'stats', 'social', 'pricing', 'stack', 'contact'],
  },
  'the-final-cut': {
    cards: ['Organising Footage', 'The First Assembly', 'Finding Structure', 'Cutting Interviews', 'Scenes And Transitions', 'Pacing', 'Sound Design', 'Colour', 'Titles And Delivery', 'Review And Notes'],
    extra: null, lessons: [5, 8, 9, 3, 4, 7, 10, 12, 4, 7], hours: '20 Hours', videos: '50 Videos',
    quote: ['“Every lesson is something you can use the same day. My edits are noticeably quicker, my interviews hold together, and my last film finally felt finished instead of merely stopped.”', 'Marcus L.'],
    cardRatio: { 8: 1.754 },
    hero: 'hero-5', thumb: 'small-2', blocks: ['quote', 'videoSlider', 'stats', 'social', 'pricing', 'stack', 'contact'],
  },
  'the-roving-eye': {
    cards: ['Seeing Like A Camera', 'Choosing Your Kit', 'Working With Light', 'Composition', 'Movement', 'Interviews', 'Vérité', 'B-Roll', 'Shooting Sequences That Cut Together', 'Wrapping A Shoot'],
    extra: null, lessons: [6, 4, 5, 5, 7, 11, 4, 10, 12, 4], hours: '22 Hours', videos: '80 Videos',
    quote: ['“I stopped chasing gadgets and started chasing extraordinary light; my footage has never looked better.”', 'Elena V.'],
    cardRatio: { 7: 1.499 },
    hero: 'founder-1-lg', thumb: 'small-1', blocks: ['quote', 'videoSlider', 'stats', 'social', 'pricing', 'stack', 'contact'],
  },
  'field-notes-pro': {
    cards: ['Camera Craft', 'Lens And Exposure', 'Working With Light', 'Moving The Camera', 'Delivering Dailies'],
    extra: null, lessons: [19, 18, 8, 11, 9], hours: '24 Hours', videos: '55 Videos',
    hero: 'founder-2-lg',
    seq: ['textMedia', 'breakdown', 'cta', 'videoSlider', 'social', 'pricing', 'stack', 'contact'],
    textMedia: {
      heading: 'Why join Field Notes Pro',
      cards: [
        { title: 'Learn on real shoots', image: 'hero-6', body: 'Follow working camera operators through real documentary days and pick up the habits that keep your footage usable and your crew calm.' },
        { title: 'Get a mentor’s eye on every shoot', image: 'hero-5', body: 'Send in your clips and get written and recorded notes from a mentor who has shot hundreds of days, so every project you finish is sharper than the last one you made.' },
        { title: 'Practise with kit you can really afford', image: 'hero-2', body: 'Lessons assume a modest camera, a basic lens kit and a window. We show you how to get cinematic results from what you already own before you spend a cent on gear.' },
      ],
    },
    cta: { image: 'hero-1', drops: ['hero-6', 'hero-5', 'founder-1-lg', 'hero-2'], heading: 'Tired of watching other people land the shoots you want?', body: 'Field Notes Pro gives you the technique, the notes and the nerve to be the one they call.' },
    pricingHeading: 'Get everything you need to launch your career as a working camera operator',
  },
  'producing-essentials': {
    cards: ['Developing Your Project', 'Funding And Budgeting Your Documentary Film', 'Building Your Crew', 'Locations And Permits', 'Schedules And Logistics', 'Running The Shoot', 'Post Workflow', 'Deliverables, Archives And Handover', 'Closing Out And Planning What Is Next'],
    extra: null, lessons: [8, 4, 4, 6, 3, 9, 5, 3, 4], hours: '16 Hours', videos: '45 Videos',
    breakdownHeading: 'Learn to fund, schedule and manage a documentary so it arrives on time and on budget.',
    hero: 'hero-1',
    seq: ['textMedia', 'breakdown', 'cta', 'videoSlider', 'social', 'pricing', 'stack', 'contact'],
    textMedia: {
      heading: 'Why learn to produce',
      cards: [
        { title: 'See the whole machine', image: 'hero-5', body: 'Understand how a documentary moves from idea to screening, and where a producer makes the decisions that save a film.' },
        { title: 'Budgets that survive contact with reality', image: 'hero-3', body: 'Build a budget, a schedule and a funding plan you can show to a commissioner without flinching, then keep it honest while the shoot unfolds.' },
        { title: 'Templates you can use tomorrow', image: 'hero-1', body: 'Every chapter ships with the spreadsheets, call sheets and contracts working producers rely on, ready to adapt to your own project.' },
      ],
    },
    cta: { image: 'hero-5', drops: ['hero-3', 'hero-1', 'founder-2-lg', 'hero-6'], heading: 'Ready to be the person who gets the film finished?', body: 'Producing Essentials teaches the unglamorous skills that make great films possible.' },
    pricingHeading: 'Get everything you need to produce your first documentary with confidence',
  },
};

const COMMON = {
  names: ['Amara', 'Leo', 'Priya', 'Marcus', 'Sofia'],
  videoHeading: 'The proof is in what our students make',
  stats: { heading: 'Make the film in your head real before the season ends', items: [['Films completed', '+1200'], ['In new client work', '$Millions'], ['Laurels and selections', '+650']] },
  socialHeading: 'Join a lively community of filmmakers',
  social: [
    {
      heading: 'Share Your Wins', name: 'Maya Okoro', date: '12 May 2024', image: 'hero-5',
      text: 'Hi all! I wanted to share a small milestone. Six months ago I had a phone, a notebook full of ideas and no clue how to turn them into a film. This weekend my short about my grandmother’s corner shop had its first public screening, and the room went quiet in exactly the place I hoped it would. Thank you to everyone here for the notes on my rough cut, especially the reminder to trust the silences. If you are sitting on an idea and waiting to feel ready, start shooting this week and post the first scene here. We will all help you shape it. Truly, thank you for being such a generous crowd.',
    },
    { heading: 'Get Feedback', video: 'hero-4' },
    {
      heading: 'Connect With Makers', name: 'Tomas Reyes', date: '3 Jun 2024', image: 'founder-1-lg', w: 900, h: 736, ratioM: '363 / 238',
      text: 'Just spent two days with three people from this group on a borrowed set. The best crash course in crew work I could ask for, and we all left with footage and some very good new friends.',
    },
  ],
  pricing: {
    heading: 'Everything you need to take a film from idea to screen',
    body: 'Turn your passion for film into real work',
    rows: ['Live Monthly Guest Sessions & Q&A', 'VIP Access To A Thriving Global Community Of Makers', 'Personal Feedback On Every Rough Cut', 'Lifetime Access To Every Lesson And Update'],
    strip2: 'Save On Courses With Membership', member: 95,
    bundleRows: ['Pick Any Combination Of Courses'], bundleStrip: ['Bundle & Save', 'Save 40%'],
  },
  stackHeading: 'Keep going with our other in-depth film courses',
  contact: 'Questions about a course, or about where to start? Our team is here to help you choose well and move your work forward.',
};

function build(c) {
  const s = SPEC[c.slug];
  const rows = [...s.cards, ...(s.extra ? [s.extra] : [])].map((t, i) => ({ title: t, lessons: lessons(i + c.n, s.lessons[i]) }));
  const others = courses.filter((o) => o.slug !== c.slug).slice(0, 6).map((o) => ({ ...o, hours: SPEC[o.slug] ? SPEC[o.slug].hours : '18 Hours', videos: SPEC[o.slug] ? SPEC[o.slug].videos : '55 Videos' }));
  const parts = {
    textMedia: () => ({ block: 'textMediaCards', ...s.textMedia }),
    breakdown: () => ({ block: 'accordion:courseBreakdown', heading: s.breakdownHeading || c.overview, cards: s.cards, rows, button: 'JOIN NOW', cardRatio: s.cardRatio || {} }),
    cta: () => ({ block: 'ctaClickImages', ...s.cta }),
    quote: () => ({ block: 'quote', text: s.quote[0], author: s.quote[1], image: s.thumb }),
    videoSlider: () => ({ block: 'videoSlider', heading: COMMON.videoHeading, names: COMMON.names }),
    stats: () => ({ block: 'stats', ...COMMON.stats, heading: s.statsHeading || COMMON.stats.heading }),
    social: () => ({ block: 'socialCards', heading: COMMON.socialHeading, cards: COMMON.social }),
    pricing: () => ({ block: 'pricingCards', ...COMMON.pricing, heading: s.pricingHeading || COMMON.pricing.heading, cost: c.cost }),
    stack: () => ({ block: 'courseCardStack', heading: COMMON.stackHeading, courses: others }),
    contact: () => ({ block: 'contactForm', heading: COMMON.contact, topics: ['General Inquiry', 'Course Inquiry', 'Team Inquiry'] }),
  };
  const seq = s.seq || ['breakdown', ...(s.cta ? ['cta'] : []), ...(s.noQuote ? [] : ['quote']), 'videoSlider', 'stats', 'social', 'pricing', 'stack', 'contact'];
  return {
    path: `/courses/${c.slug}`, title: c.title, description: c.overview, active: '', course: c.slug, bodyClass: 'course-page',
    blocks: [
      { block: 'courseHero', course: c, image: s.hero, format: 'Online', access: 'Lifetime', completion: 'Certificate', contains: c.included.slice(0, 5) },
      { block: 'courseBody', blocks: seq.map((k) => parts[k]()) },
    ],
  };
}

module.exports = { SPEC, COMMON, build, lessons };
