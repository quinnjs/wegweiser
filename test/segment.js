'use strict';

var assert = require('assertive-as-promised');

var route = require('../');

describe('path segment', function() {
  describe('with explicit method', function() {
    it('works', function() {
      var originalReq = { url: '/foo/_search/xy?a=b', method: 'GET' };

      var handle = route(function(router) {
        router.GET('/:thing/_search/:ding', function(req, params) {
          assert.equal(originalReq, req);
          assert.equal('foo', params.thing);
          assert.equal('xy', params.ding);
          return 'ok';
        });
      });
      var res = handle(originalReq);
      assert.equal('ok', res);
    });
  });

  describe('for ALL methods', function() {
    it('works', function() {
      var originalReq = { url: '/foo/_search/xy?a=b', method: 'PUT' };

      var handle = route(function(router) {
        router.ALL('/:thing/_search/:ding', function(req, params) {
          assert.equal(originalReq, req);
          assert.equal('foo', params.thing);
          assert.equal('xy', params.ding);
          return 'ok';
        });
      });
      var res = handle(originalReq);
      assert.equal('ok', res);
    });
  });

  describe('without match', function() {
    it('returns undefined', function() {
      var originalReq = { url: '/foo?a=b', method: 'PUT' };

      var handle = route(function(router) {
        router.GET('/:thing/_search/:ding', function(req, params) {
          throw new Error('Should not be called');
        });
      });
      var res = handle(originalReq);
      assert.equal(undefined, res);
    });
  });
});
