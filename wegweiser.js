'use strict';

const createMatcher = require('./matcher');

exports.getRouteArg = createMatcher.getRouteArg;

createMatcher.methods.forEach(function(method) {
  exports[method] = createMatcher[method];
});
