'use strict';

const parseUrl = require('url').parse;

function nonEmpty(str) { return str !== ''; }

const routeArgsByReq = new WeakMap();
const matcherOptions = new WeakMap();

function createMatcher(method, strings, dynamicSegments, onMatch, context) {
  const staticSegments = strings.map(function(str) {
    return str.split('/').filter(nonEmpty);
  });

  const expectedLength = staticSegments.reduce(function(sum, item) {
    return sum + item.length;
  }, dynamicSegments.length);

  function matcher(req) {
    if (req.method !== method) return;

    const segments = parseUrl(req.url).pathname
      .split('/').filter(nonEmpty);

    if (segments.length !== expectedLength) return;

    let curIdx = 0, curSubIdx = 0, nextDynamic = 0;
    let cur = staticSegments[0], curSubMax = cur.length;

    let args = [];

    for (const segment of segments) {
      if (curSubMax === curSubIdx) {
        const param = dynamicSegments[nextDynamic++];
        let value = segment;
        if (typeof param === 'string') {
          args[param] = value;
        } else if (typeof param === 'function') {
          value = param(value);
          if (value === undefined) return;
        }
        args.push(value);

        cur = staticSegments[++curIdx];
        if (!cur) return;
        curSubIdx = 0, curSubMax = cur.length;
      } else if (cur[curSubIdx++] !== segment) {
        return;
      }
    }

    routeArgsByReq.set(req, args);
    return onMatch.apply(context, [ req ].concat(args));
  }

  matcherOptions.set(matcher, {
    method: method,
    staticSegments: staticSegments,
    dynamicSegments: dynamicSegments,
    onMatch: onMatch,
    context: context
  });

  return matcher;
}

function getRouteArg(req, name) {
  const args = routeArgsByReq.get(req);
  if (args === undefined) {
    throw new Error('Could not find route arguments for request');
  }
  return args[name];
}
createMatcher.getRouteArg = getRouteArg;

const methods = [ 'GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD' ];
createMatcher.methods = methods;

methods.forEach(function(method) {
  createMatcher[method] = function methodMatcher(strings) {
    const params = [].slice.call(arguments, 1);
    return function(onMatch) {
      return createMatcher(method, strings, params, onMatch, null);
    };
  }
});

module.exports = createMatcher;
createMatcher['default'] = createMatcher;
