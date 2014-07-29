'use strict';

var assert = require('assertive-as-promised');

var route = require('../');

describe('exact match', function() {
  describe('with explicit method', function() {
    it('works', function() {
      var originalReq = { url: '/foo?a=b', method: 'GET' };

      var handle = route(function(router) {
        router.GET('/foo', function(req, params) {
          assert.equal(originalReq, req);
          return 'ok';
        });
      });
      var res = handle(originalReq);
      assert.equal('ok', res);
    });
  });

  describe('for ALL methods', function() {
    it('works', function() {
      var originalReq = { url: '/foo?a=b', method: 'PUT' };

      var handle = route(function(router) {
        router.ALL('/foo', function(req, params) {
          assert.equal(originalReq, req);
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
        router.ALL('/bar', function(req, params) {
          throw new Error('Should not be called');
        });
      });
      var res = handle(originalReq);
      assert.equal(undefined, res);
    });
  });

  describe('match for different method only', function() {
    it('returns undefined', function() {
      var originalReq = { url: '/foo?a=b', method: 'PUT' };

      var handle = route(function(router) {
        router.POST('/foo', function(req, params) {
          throw new Error('Should not be called');
        });
      });
      var res = handle(originalReq);
      assert.equal(undefined, res);
    });
  });
});
