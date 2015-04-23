'use strict';

const test = require('tape');
const path = require('path');

process.argv.slice(2).forEach(file => {
  require(path.resolve(file));
});
