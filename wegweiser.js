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
    
    const constructAndHandle = function constructAndHandle(req, params) {
      const instance = new ctor(req);
      return instance[key](req, params);
    };

    constructAndHandle.ctor = ctor;
    constructAndHandle.key = key;

    return constructAndHandle;
  } else if (result.ctx !== null && typeof result.ctx === 'object') {
    const ctx = result.ctx, key = result.key;

    const applyHandlerToContext = function applyHandlerToContext(req, params) {
      return ctx[key](req, params);
    };

    applyHandlerToContext.ctx = ctx;
    applyHandlerToContext.key = key;

    return applyHandlerToContext;
  }
  return result.target;
}

function createRouter() {
  const targets = slice.call(arguments);
  const router = routington();

  for (let target of targets) {
    for (let result of scan(target, Route)) {
      const a = result.annotation,
            method = a.method,
            url = a.url,
            callsiteError = a.callsiteError;
      const node = router.define(url)[0];
      if (node[method]) {
        const error = callsiteError || new Error();
        error.message =
          `Ambiguous route definition for ${method} ${url}`;
        throw error;
      }
      node[method] = createHandler(result);
    }
  }

  function resolve(req) {
    const match = router.match(getPathname(req.url));
    const handler = match && match.node[req.method];
    if (!handler) return;
    return { handler: handler, params: match.param };
  }

  function route(req) {
    const resolved = resolve(req);
    if (!resolved) return;
    const handler = resolved.handler;
    return handler(req, resolved.params);
  }

  route.resolve = resolve;

  return route;
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
