'use strict';

const routington = require('routington');

const A = require('./annotations');
const scan = require('./scan');

const slice = Array.prototype.slice;

function getPathname(url) { return url.split('?')[0]; }

function createRouter() {
  const targets = slice.call(arguments);
  const router = routington();

  for (let target of targets) {
    for (let route of scan(target)) {
      const node = router.define(route.url)[0];
      if (node[route.method]) {
        const error = route.callsiteError || new Error();
        error.message =
          `Ambiguous route definition for ${route.method} ${route.url}`;
        throw error;
      }
      node[route.method] = route.handler;
    }
  }

  return function route(req) {
    const match = router.match(getPathname(req.url));
    const handler = match && match.node[req.method];
    if (!handler) return;
    return handler(req, match.param);
  };
}

A.methods.forEach(function(method) {
  createRouter[method] = A[method];
});

module.exports = createRouter;
createRouter['default'] = createRouter;
createRouter.createRouter = createRouter;
