'use strict';
// /courses/<slug> — the full course template (hero + breakdown + proof + pricing + stack + contact).
const courses = require('../data/courses.cjs');
const { SPEC, build } = require('../data/course-pages.cjs');
module.exports = Object.keys(SPEC).map((slug) => build(courses.find((c) => c.slug === slug)));
