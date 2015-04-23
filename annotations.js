'use strict';

const ANNOTATION = Symbol.for('wegweiser:annotation');
const ANNOTATIONS = Symbol.for('wegweiser:annotations');

function getAnnotations(f) {
  return f[ANNOTATION] || [];
}

function getPropertyAnnotations(obj, name) {
  const annotationMap = obj[ANNOTATIONS];
  return (annotationMap && annotationMap[name]) || [];
}

function getAnnotatedProperties(obj) {
  return Object.keys(obj[ANNOTATIONS] || {});
}

function setPropertyAnnotations(obj, name, annotations) {
  const annotationMap = obj[ANNOTATIONS] || (obj[ANNOTATIONS] = {});
  annotationMap[name] = annotations;
}

function getScopedAnnotate(method, url, callsiteError) {
  const annotation = {
    method: method,
    url: url,
    callsiteError: callsiteError
  };

  return function annotate(target, name, descriptor) {
    if (arguments.length === 1) { // single function case
      if (typeof target !== 'function') {
        throw new TypeError(
          `Unexpected ${typeof target}, handler function expected`);
      }
      target[ANNOTATION] = getAnnotations(target).concat([ annotation ]);
      return target;
    } else { // decorator case
      let annotations = getAnnotations(descriptor.value);
      if (annotations.length === 0) {
        annotations = getPropertyAnnotations(target, name);
      }
      annotations = annotations.concat([ annotation ]);
      setPropertyAnnotations(target, name, annotations);
      descriptor.value[ANNOTATION] = annotations;
    }
  };
}

const methods = [ 'GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS' ];
exports.methods = methods;

methods.forEach(function(method) {
  function METHOD(url) {
    const callsiteError = new Error();
    Error.captureStackTrace(callsiteError, METHOD);
    return getScopedAnnotate(method, url, callsiteError);
  }
  exports[method] = METHOD;
});

exports.getAnnotations = getAnnotations;
exports.getPropertyAnnotations = getPropertyAnnotations;
exports.getAnnotatedProperties = getAnnotatedProperties;
