'use strict';

const routington = require('routington');
const Annotation = require('footnote'),
      scan = Annotation.scan,
      createAnnotation = Annotation.create;

const METHODS = [ 'GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS' ];

const slice = Array.prototype.slice;

function Route(method, url, callsiteError) {
  return createAnnotation(Route.prototype, {
    method: { value: method, enumerable: true },
    url: { value: url, enumerable: true },
    callsiteError: { value: callsiteError },
  });
}

function getPathname(url) { return url.split('?')[0]; }

function createHandler(result) {
  if (typeof result.ctor === 'function') {
    const ctor = result.ctor, key = result.key;
    
    return function constructAndHandle(req) {
      const instance = new ctor(req);
      return instance[key].apply(instance, arguments);
    };
  }
  return result.target;
}

function createRouter() {
  const targets = slice.call(arguments);
  const router = routington();

  for (let target of targets) {
    for (let result of scan(target, Route)) {
      const route = result.annotation;
      const node = router.define(route.url)[0];
      if (node[route.method]) {
        const error = route.callsiteError || new Error();
        error.message =
          `Ambiguous route definition for ${route.method} ${route.url}`;
        throw error;
      }
      node[route.method] = createHandler(result);
    }
  }

  return function route(req) {
    const match = router.match(getPathname(req.url));
    const handler = match && match.node[req.method];
    if (!handler) return;
    return handler(req, match.param);
  };
}

METHODS.forEach(function(method) {
  createRouter[method] = function METHOD(url) {
    const callsiteError = new Error();
    Error.captureStackTrace(callsiteError, METHOD);
    return Route(method, url, callsiteError);
  };
});
createRouter.Route = Route;

module.exports = createRouter;
createRouter['default'] = createRouter;
createRouter.createRouter = createRouter;
