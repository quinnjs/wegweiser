'use strict';

var METHODS = require('http').METHODS;

var handleWithMatchers = require('./matcher');

// Not all node versions supports this
if (METHODS === undefined) METHODS = require('./methods');


  function Router() {
    this.matchers = [];

    this.$Router0();
  }

  Router.prototype.addRoute=function(method, path, handler) {
    this.matchers.push({
      method: method,
      path: path,
      handler: handler
    });
    return this;
  };

  Router.prototype.$Router0=function() {
    var verb, i;
    for (i = 0; i < METHODS.length; ++i) {
      verb = METHODS[i];
      this[verb] = this.addRoute.bind(this, verb);
      this[verb.toLowerCase()] = this.addRoute.bind(this, verb);
    }

    this['ALL'] = this.addRoute.bind(this, null);
    this['all'] = this.addRoute.bind(this, null);

    this['del'] = this.addRoute.bind(this, 'DELETE');
  };


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

module.exports = route;
module.exports.Router = Router;module.exports.route = route;
