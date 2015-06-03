'use strict';

const test = require('tape');

const Wegweiser = require('../'),
      createRouter = Wegweiser.createRouter,
      GET = Wegweiser.GET;

test('duplicate routes', function(t) {
  try {
    createRouter(
      GET('/healthy')(function() {}),
      GET('/healthy')(function() {})
    );
    t.fail('Should have thrown');
    t.end();
  } catch (error) {
    t.equal(error.message, 'Ambiguous route definition for GET /healthy',
      'Complains about ambiguous route definition');
    const lines = error.stack.split('\n');
    t.ok(/\/test\/router.js\:/.test(lines[1]),
      'First line of the stack trace points to the route definition');
    t.end();
  }
});

test('createRouter', function(t) {
  function Resource() {
    this.attr = 'ok';
  }
  Resource.prototype.getFoo = GET('/foo')(function(req) {
    return `get foo:${req.url} - ${this.attr}`;
  });
  Resource.prototype.getPage = GET('/p/:id')(function(req, params) {
    return `get page #${params.id} - ${this.attr}`;
  });

  function healthcheck(req) { return 'ok'; }

  function CustomResource(prop) {
    this.prop = prop;
  }
  CustomResource.prototype.getBar = GET('/bar')(function(req) {
    return `get bar:${req.url} - ${this.prop}`;
  });

  const route = createRouter(Resource, GET('/healthy')(healthcheck), new CustomResource('kk'));

  t.equal(route({ method: 'GET', url: '/' }), undefined,
    'Returns `undefined` when url isn\'t routed');

  t.equal(route({ method: 'PUT', url: '/foo' }), undefined,
    'Returns `undefined` when method does not match');

  t.equal(route({ method: 'GET', url: '/foo' }), 'get foo:/foo - ok',
    'Forwards return value for simple static route');

  t.equal(route({ method: 'GET', url: '/p/home' }), 'get page #home - ok',
    'Forwards return value with path parameter');

  t.equal(route({ method: 'GET', url: '/healthy' }), 'ok',
    'Supports multiple scan targets');

  t.equal(route({ method: 'GET', url: '/healthy?foo=bar' }), 'ok',
    'Ignores query string');

  t.equal(route({ method: 'GET', url: '/bar' }), 'get bar:/bar - kk',
    'Supports objects');

  t.end();
});
