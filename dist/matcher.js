'use strict';

var parseUrl = require('parseurl');

var matchRoute = require('./compile').matchRoute;

function segmentsMatcher(method, pattern, handler) {
  return function(req) {
    var parsed = parseUrl(req);
    var params = matchRoute(req.method, parsed, method, pattern);
    if (params === null) {
      return null;
    }
    return handler(req, params);
  };
}

function exactMatcher(method, pattern, handler) {
  return function(req) {
    if (method !== null && req.method !== method) {
      return null;
    }
    var parsed = parseUrl(req);
    if (parsed.pathname === pattern) {
      return handler(req, {});
    }
    return null;
  };
}

function makeMatcher(opts) {
  var method = opts.method, pattern = opts.pattern, handler = opts.handler;
  if (pattern.indexOf('{') === -1) {
    return exactMatcher(method, pattern, handler);
  } else {
    return segmentsMatcher(method, pattern, handler);
  }
}

function handleWithMatchers(matchers) {
  matchers = matchers.map(makeMatcher);
  var len = matchers.length;

  return function(req) {
    var idx, res;
    for (idx = 0; idx < len; ++idx) {
      res = matchers[idx](req);
      if (res !== null) {
        return res;
      }
    }
  };
}

module.exports = handleWithMatchers;
