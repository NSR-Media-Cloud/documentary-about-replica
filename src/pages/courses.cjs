'use strict';
// /courses — the listing. (Course detail pages live in course-detail.cjs.)
module.exports = {
  path: '/courses',
  title: 'Courses',
  description: 'Practical documentary courses, taught by working filmmakers',
  active: '/courses',
  blocks: [
    { block: 'coursesPage', tag: 'Courses', heading: 'The RTA Courses', body: 'Practical documentary teaching, taught by makers.' },
  ],
};
