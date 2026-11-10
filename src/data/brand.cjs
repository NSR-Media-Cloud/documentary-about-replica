'use strict';
// The academy wordmark as vector data (assets/svg/logo.json), shared by blocks that draw it inline.
const fs = require('fs');
const path = require('path');

exports.logo = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'svg', 'logo.json'), 'utf8'));
