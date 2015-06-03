'use strict';

const test = require('tape');

const createRouter = require('../');

function f() {}

class MyResource {
  del() {}
}

class CustomResource {
  change() {}
}

createRouter.DELETE('/my/:id')(MyResource.prototype, 'del',
  Object.getOwnPropertyDescriptor(MyResource.prototype, 'del'));

createRouter.PUT('/custom/:thing')(CustomResource.prototype, 'change',
  Object.getOwnPropertyDescriptor(CustomResource.prototype, 'change'));

const instance = new CustomResource();

const router = createRouter(
  createRouter.GET('/f')(f),
  instance,
  MyResource
);

test('function target', function(t) {
  const result = router.resolve({ method: 'GET', url: '/f' });
  t.deepEqual(result.params, {}, 'has params');
  t.equal(result.handler, f, 'returns the handler');
  t.end();
});

test('resource class, method target', function(t) {
  const result = router.resolve({ method: 'DELETE', url: '/my/x' });
  t.deepEqual(result.params, { id: 'x' }, 'has params');
  t.equal(result.handler.key, 'del', 'passes property key');
  t.equal(result.handler.ctor, MyResource, 'passes constructor');
  t.end();
});

test('resource instance, method target', function(t) {
  const result = router.resolve({ method: 'PUT', url: '/custom/boat' });
  t.deepEqual(result.params, { thing: 'boat' }, 'has params');
  t.equal(result.handler.key, 'change', 'passes property key');
  t.equal(result.handler.ctx, instance, 'passes context object');
  t.end();
});
