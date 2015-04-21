'use strict';

const createMatcher = require('./matcher');

for (const method of createMatcher.methods) {
  exports[method] = createMatcher[method];
}
