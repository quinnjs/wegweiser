'use strict';

const util = require('util');

const test = require('tape');

const A = require('../annotations');
const scan = require('../scan');

test('scan functions', t => {
  function getFoo(req) { return 'ok'; }

  A.GET `/foo` (getFoo);
  A.HEAD `/foo` (getFoo);

  const routes = scan(getFoo);
  t.equal(routes.length, 2, 'Both routes are discovered');

  routes.forEach(function(route) {
    t.strictEqual(route.handler, getFoo, 'The handler is getFoo itself');
  });

  t.equal(routes[0].annotation.method, 'GET', 'First is first');
  t.equal(routes[1].annotation.method, 'HEAD', 'Second is second');

  t.end();
});

test('scan class', t => {
  function BaseResource() {
    this.prefix = 'base:';
  }
  BaseResource.prototype.val = 'some value';
  BaseResource.prototype.randomFn = function() {};
  const baseX = {
    value: function(req) { return `${this.prefix}x`; },
    configurable: true,
    writable: true
  };
  Object.defineProperty(BaseResource.prototype, 'x',
    (A.POST `/` (BaseResource.prototype, 'x', baseX)) || baseX);
  const baseBar = {
    value: function(req) { return `${this.prefix}bar`; },
    configurable: true,
    writable: true
  }
  Object.defineProperty(BaseResource.prototype, 'bar',
    (A.PUT `/bar` (BaseResource.prototype, 'bar', baseBar)) || baseBar);

  function Resource() {
    BaseResource.apply(this);
    this.prefix = 'derived:';
  }
  util.inherits(Resource, BaseResource);
  Resource.prototype.x = A.DELETE `/zapp` (function(req) { return 'zapp'; });
  Resource.prototype.foo = A.GET `/x` (function(req) { return `${this.prefix}foo`; });

  const routes = scan(Resource);

  t.equal(routes.length, 3, 'Discovers one route per property');

  // BaseResource:
  t.equal(routes[0].handler(), 'derived:bar');
  t.equal(routes[0].annotation.method, 'PUT');
  // Resource:
  t.equal(routes[1].handler(), 'zapp');
  t.equal(routes[1].annotation.method, 'DELETE');
  t.equal(routes[2].handler(), 'derived:foo');
  t.equal(routes[2].annotation.method, 'GET');

  t.end();
});
