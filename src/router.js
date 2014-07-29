'use strict';

import { METHODS } from 'http';

import handleWithMatchers from './matcher';

// Not all node versions supports this
if (METHODS === undefined) METHODS = require('./methods');

class Router {
  constructor() {
    this.matchers = [];

    this._addVanityMethods();
  }

  addRoute(method, pattern, handler) {
    this.matchers.push({
      method: method,
      pattern: pattern,
      handler: handler
    });
    return this;
  }

  _addVanityMethods() {
    var verb, i;
    for (i = 0; i < METHODS.length; ++i) {
      verb = METHODS[i];
      this[verb] = this.addRoute.bind(this, verb);
      this[verb.toLowerCase()] = this.addRoute.bind(this, verb);
    }

    this.ALL = this.addRoute.bind(this, null);
    this.all = this.addRoute.bind(this, null);

    this.del = this.addRoute.bind(this, 'DELETE');
  }
}

Object.defineProperty(Router.prototype, 'handle', {
  get: function() {
    return handleWithMatchers(this.matchers);
  }
});

function route(spec) {
  var router = new Router();
  spec(router);
  return router.handle;
}

export default route;
export { Router, route };
