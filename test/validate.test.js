'use strict';

var test = require('ava')

var validate = require('../')

test('should validate sample where result is matching', function(t) {
  var sample = [
    '2 + 3',
    '// => 5'
  ].join('\n')

  var result = validate(sample)

  t.same(result, { ok: true })
})

test('should throw an error when sample is not valid', function(t) {
  var sample = [
    '2 + 3',
    '// => 6'
  ].join('\n')

  var result = validate(sample)

  t.same(result, { ok: false})
})

test.skip('should throw an error when error is thrown in sample', function(t) {
})

test.skip('should throw an error when assert fails in sample', function(t) {
})

test.skip('should be able to inject context in sample', function(t) {
})
