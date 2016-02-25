'use strict'

const test = require('ava')

const evaluate = require('../../lib/evaluate')

test('should evaluate simple expression', (t) => {
  t.plan(1)
  const sample = '2 + 3'
  const options = {}

  const result = evaluate(sample, options)

  t.is(result, 5)
})

test('should return the result of the last expression', (t) => {
  t.plan(1)
  const sample = `
    3 + 6
    // => 9
    2 + 3
  `
  const options = {}

  const result = evaluate(sample, options)

  t.is(result, 5)
})

test('should return the string value of an error if one occurred during the evaluation', (t) => {
  t.plan(1)
  const sample = '2 += 3'
  const options = {}

  const result = evaluate(sample, options)

  t.is(result, 'ReferenceError: Invalid left-hand side in assignment')
})

test('should not get confused by the lack of semi-colons', (t) => {
  t.plan(1)
  const sample = '[1, 2, 3]\n[2].concat(3)'
  const options = {}

  const result = evaluate(sample, options)

  t.same(result, [2, 3])
})

test('should be able to read properly indented multi-line value, even when using [] or ()', (t) => {
  t.plan(1)
  const sample = '[1, 2, 3]\n  [0]'
  const options = {}

  const result = evaluate(sample, options)

  t.is(result, 1)
})

test('should be able to inject dependencies', (t) => {
  t.plan(1)
  const sample = `
    _.map([1, 2, 3], function(a) {
      return a + 1;
    })
  `
  const options = {
    dependencies: {
      '_': {
        path: 'lodash'
      }
    }
  }

  const result = evaluate(sample, options)

  t.same(result, [2, 3, 4])
})

test('should be able to inject context', (t) => {
  t.plan(1)
  const sample = `
    MAX_VALUE - 1
  `
  const options = {
    context: {
      MAX_VALUE: 5
    }
  }

  const result = evaluate(sample, options)

  t.is(result, 4)
})
