// 'use strict';

// const assert = require('assert');

// const Wegweiser = require('../'),
//       GET = Wegweiser.GET;

// describe('Using decorators', function() {
//   const obj = { prefix: '#' };
//   const descriptor = GET `/foo/${String}` (obj, 'getFoo', {
//     enumberable: false,
//     configurable: true,
//     writeable: true,
//     value: function getFoo(req, id) {
//       return this.prefix + id;
//     }
//   });
//   Object.defineProperty(obj, 'getFoo', descriptor);

//   it('results in a valid property', function() {
//     assert.strictEqual(typeof obj.getFoo, 'function');
//   });

//   it('returns the original result when route matches', function() {
//     assert.strictEqual(obj.getFoo({
//       method: 'GET',
//       url: '/foo/bar?a=b'
//     }), '#bar');
//   });

//   it('returns undefined for other route', function() {
//     assert.strictEqual(obj.getFoo({
//       method: 'PUT',
//       url: '/foo/bar?a=b'
//     }), undefined);

//     assert.strictEqual(obj.getFoo({
//       method: 'GET',
//       url: '/foo'
//     }), undefined);
//   });
// });
