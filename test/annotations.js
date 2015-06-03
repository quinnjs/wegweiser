'use strict';

const test = require('tape');
const scan = require('footnote').scan;

const _tmp = require('..'),
      GET = _tmp.GET,
      PUT = _tmp.PUT;

function handler(req) { return 'ok'; }

test('Function annotation', function(t) {
  const first = GET('/')(handler);
  const second = PUT('/bar')(handler);

  t.equal(first, second); // no wrapping
  t.equal(first, handler);

  const results = scan(handler);
  t.equal(results.length, 2);
  t.equal(results[0].annotation.method, 'GET');
  t.deepEqual(results[0].annotation.url, '/');
  t.equal(results[1].annotation.method, 'PUT');
  t.deepEqual(results[1].annotation.url, '/bar');

  t.end();
});

test('Property annotation', function(t) {
  function getFoo() {}

  const resource = {};
  const fooDescriptor = { value: getFoo, configurable: true, writable: true };
  Object.defineProperty(resource, 'getFoo',
    (GET('/foo')(resource, 'getFoo', fooDescriptor)) || fooDescriptor);

  t.equal(resource.getFoo, getFoo);
  t.equal(scan(resource.getFoo).length, 1);

  t.equal(scan(resource).length, 1,
    'properties are discovered via the object as well');

  resource.getFoo = resource.getFoo.bind(resource);
  t.equal(scan(resource.getFoo).length, 0); // bind lost our property

  t.end();
});
