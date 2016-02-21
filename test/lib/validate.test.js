'use strict'

var path = require('path')
var test = require('ava')

var validate = require('../../lib/validate')

test('should validate sample where result is matching', function (t) {
  var sample = [
    '2 + 3',
    '// => 5'
  ].join('\n')

  var result = validate(sample)

  t.same(result, [])
})

test('should validate sample where result is matching and needs deep-equality checking', function (t) {
  var sample = [
    '[2].concat(3)',
    '// => [2, 3]'
  ].join('\n')

  var result = validate(sample)

  t.same(result, [])
})

test('should throw an error when sample is not valid', function (t) {
  var sample = [
    '2 + 3',
    '// => 6'
  ].join('\n')

  var result = validate(sample)

  t.same(result, [{
    code: '2 + 3',
    expected: 6,
    expression: '2 + 3',
    got: 5,
    line: 1
  }])
})

test('should throw an error when error is thrown in sample', function (t) {
  var sample = [
    'var a = {}',
    'a.getUnknownMethod()',
    '// => 6'
  ].join('\n')

  var result = validate(sample)

  t.same(result, [{
    code: [
      'var a = {}',
      'a.getUnknownMethod()'
    ].join('\n'),
    expected: 6,
    expression: 'a.getUnknownMethod()',
    got: 'TypeError: a.getUnknownMethod is not a function',
    line: 2
  }])
})

test('should validate when error is expected', function (t) {
  var sample = [
    'var a = {}',
    'a.getUnknownMethod()',
    '// => "TypeError: a.getUnknownMethod is not a function"'
  ].join('\n')

  var result = validate(sample)

  t.same(result, [])
})

test('should throw an error when assert fails in sample', function (t) {
  var sample = [
    'var assert = require("assert")',
    'assert.equal(1, 2)',
    '// => "AssertionError: 1 == 2"'
  ].join('\n')

  var result = validate(sample)

  t.same(result, [])
})

test('should be able to inject context in sample', function (t) {
  var context = {
    lib: {
      return6: function () { return 6 }
    }
  }
  var sample = [
    'lib.return6()',
    '// => 6'
  ].join('\n')

  var result = validate(sample, { context: context })

  t.same(result, [])
})

test('should be able to inject dependencies in sample', function (t) {
  var dependencies = {
    timesThree: {
      path: path.join(__dirname, '../fixtures/timesThree')
    }
  }
  var sample = [
    'timesThree(3)',
    '// => 9'
  ].join('\n')

  var result = validate(sample, { dependencies: dependencies })

  t.same(result, [])
})

test('should be able to inject property of a dependency in sample', function (t) {
  var dependencies = {
    timesFour: {
      path: path.join(__dirname, '../fixtures/timesThree'),
      property: 'timesFour'
    }
  }
  var sample = [
    'timesFour(3)',
    '// => 12'
  ].join('\n')

  var result = validate(sample, { dependencies: dependencies })

  t.same(result, [])
})
