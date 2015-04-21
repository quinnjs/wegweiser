'use strict';

const assert = require('assert');

const Wegweiser = require('../'),
      GET = Wegweiser.GET;

describe('matcher', function() {
  describe('static path', function() {
    const handler = GET `/foo` (function(req) {
      return { request: req };
    });

    it('accepts GET /foo', function() {
      const req = { method: 'GET', url: '/foo' };
      const res = handler(req);
      assert.strictEqual(res.request, req);
    });

    it('does not accept GET /bar', function() {
      const req = { method: 'GET', url: '/bar' };
      const res = handler(req);
      assert.strictEqual(res, undefined);
    });

    it('accepts GET /foo?a=b', function() {
      const req = { method: 'GET', url: '/foo?a=b' };
      const res = handler(req);
      assert.strictEqual(res.request, req);
    });

    it('does not accept PUT /foo', function() {
      const req = { method: 'PUT', url: '/foo' };
      const res = handler(req);
      assert.strictEqual(res, undefined);
    });
  });

  describe('with segment', function() {
    const handler = GET `/page/${'id'}/preview` (function(req, id) {
      return { request: req, id: id };
    });

    it('accepts GET /page/123/preview', function() {
      const req = { method: 'GET', url: '/page/123/preview' };
      const res = handler(req);
      assert.strictEqual(res.request, req);
      assert.strictEqual(res.id, '123');
    });
  });

  describe('with Number segment', function() {
    const handler = GET `/page/${Number}/preview` (function(req, id) {
      return { request: req, id: id };
    });

    it('converts the segment to a number', function() {
      const req = { method: 'GET', url: '/page/123/preview' };
      const res = handler(req);
      assert.strictEqual(res.request, req);
      assert.strictEqual(res.id, 123);
    });
  });
});
