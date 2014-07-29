'use strict';

import parseUrl from 'parseurl';

import { matchRoute } from './compile';

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

function exactMatcher(method, path, handler) {
  return function(req) {
    if (method !== null && req.method !== method) {
      return null;
    }
    var parsed = parseUrl(req);
    if (parsed.pathname === path) {
      return handler(req, {});
    }
    return null;
  }
}

function makeMatcher(opts) {
  var method = opts.method, path = opts.path, handler = opts.handler;
  if (path.indexOf('{') === -1) {
    return exactMatcher(method, path, handler);
  } else {
    return segmentsMatcher(method, path, handler);
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

export default handleWithMatchers;
