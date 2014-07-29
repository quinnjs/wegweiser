'use strict';

var parseUrl = require('parseurl');
var routington = require('routington');

function handleWithMatchers(matchers) {
  var trieByMethod = {};

  function getTrieForMethod(method) {
    if (trieByMethod[method] === undefined) {
      trieByMethod[method] = routington();
    }
    return trieByMethod[method];
  }

  function register(trie, matcher) {
    var pattern = matcher.pattern;
    var nodes = trie.define(pattern);
    var node = nodes[0];
    node.handler = matcher.handler;
  }

  matchers.forEach(function(matcher) {
    if (matcher.method !== null) {
      register(getTrieForMethod(matcher.method), matcher);
    } else {
      register(getTrieForMethod('ALL'), matcher);
    }
  });

  return function(req) {
    var trie = trieByMethod[req.method] || trieByMethod.ALL;
    if (!trie) return;

    var parsed = parseUrl(req);
    var match = trie.match(parsed.pathname);
    if (match === undefined) return;

    var handler = match.node.handler;
    var params = match.param;
    if (handler === undefined) return;

    return handler(req, params);
  };
}

module.exports = handleWithMatchers;
