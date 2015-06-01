'use strict';

const test = require('tape');

const createRouter = require('../');

function f() {}

class MyResource {
  del() {}
}

createRouter.DELETE('/my/:id')(MyResource.prototype, 'del',
  Object.getOwnPropertyDescriptor(MyResource.prototype, 'del'));

const router = createRouter(
  createRouter.GET('/f')(f),
  MyResource
);

test('function target', function(t) {
  const result = router.resolve({ method: 'GET', url: '/f' });
  t.deepEqual(result.params, {}, 'has params');
  t.equal(result.handler, f, 'returns the handler');
  t.end();
});

test('resource method target', function(t) {
  const result = router.resolve({ method: 'DELETE', url: '/my/x' });
  t.deepEqual(result.params, { id: 'x' }, 'has params');
  t.equal(result.handler.key, 'del', 'passes property key');
  t.equal(result.handler.ctor, MyResource, 'passes constructor');
  t.end();
});
