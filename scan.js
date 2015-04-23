'use strict';

const A = require('./annotations');

const concat = [].concat;

function truthy(x) { return !!x; }

function scanFunction(handler) {
  const annotations = A.getAnnotations(handler);
  return annotations.map(function(annotation) {
    return {
      annotation: annotation,
      handler: handler
    };
  });
}

function instantiateAndHandle(ctor, prop) {
  return function _handle(req) {
    const instance = new ctor(req);
    return instance[prop].apply(instance, arguments);
  };
}

function scanPrototypeChain(ctor, proto, seen) {
  if (proto === null || proto === Object.prototype) {
    return [];
  }

  const own = Object.getOwnPropertyNames(proto)
    .map(function(prop) {
      if (seen.indexOf(prop) !== -1) return false;
      seen.push(prop);

      const method = proto[prop];
      if (typeof method !== 'function') return false;
      let annotations = A.getAnnotations(method);

      if (annotations.length === 0) {
        // see if we can read some from the object
        annotations = A.getPropertyAnnotations(proto, prop);
      }

      return annotations.map(function(annotation) {
        return {
          annotation: annotation,
          handler: instantiateAndHandle(ctor, prop)
        };
      });
    })
    .filter(truthy);

  const parent = scanPrototypeChain(ctor, Object.getPrototypeOf(proto), seen);

  return concat.apply(parent, own);
}

function scan(target) {
  if (typeof target === 'function') {
    return scanFunction(target)
      .concat(scanPrototypeChain(target, target.prototype, [ 'constructor' ]));
  }
  return [];
}

module.exports = scan;
scan['default'] = scan;
