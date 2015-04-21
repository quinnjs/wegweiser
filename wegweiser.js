'use strict';

const createMatcher = require('./matcher');

exports.getRouteArg = createMatcher.getRouteArg;

for (const method of createMatcher.methods) {
  exports[method] = createMatcher[method];
}
