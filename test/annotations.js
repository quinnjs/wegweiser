'use strict';

const test = require('tape');

const A = require('../annotations'),
      GET = A.GET,
      PUT = A.PUT,
      getAnnotations = A.getAnnotations,
      getPropertyAnnotations = A.getPropertyAnnotations;

function handler(req) { return 'ok'; }
function getFoo() {}

test('Function annotation', function(t) {
  const first = GET('/')(handler);
  const second = PUT('/bar')(handler);

  t.equal(first, second); // no wrapping
  t.equal(first, handler);

  const annotations = getAnnotations(handler);
  t.equal(annotations.length, 2);
  t.equal(annotations[0].method, 'GET');
  t.deepEqual(annotations[0].url, '/');
  t.equal(annotations[1].method, 'PUT');
  t.deepEqual(annotations[1].url, '/bar');

  t.end();
});

test('Property annotation', function(t) {
  const resource = {};
  const fooDescriptor = { value: getFoo, configurable: true, writable: true };
  Object.defineProperty(resource, 'getFoo',
    (GET('/foo')(resource, 'getFoo', fooDescriptor)) || fooDescriptor);
  t.equal(resource.getFoo, getFoo);
  t.equal(getAnnotations(resource.getFoo).length, 1);
  t.equal(getPropertyAnnotations(resource, 'getFoo').length, 1);
  resource.getFoo = resource.getFoo.bind(resource);
  t.equal(getAnnotations(resource.getFoo).length, 0); // bind lost our property
  t.equal(getPropertyAnnotations(resource, 'getFoo').length, 1); // to the rescue!

  t.end();
});
