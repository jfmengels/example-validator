'use strict'

const test = require('ava')

const preprocess = require('./preprocessSample')

test('should inject a dependency in sample', (t) => {
  t.plan(1)
  const sample = '2 + foo()'
  const options = {
    dependencies: {
      foo: {
        path: 'bar'
      }
    }
  }

  const newSample = preprocess(sample, options)

  t.is(newSample, `var foo = require("bar");\n2 + foo()`)
})

test('should inject context in sample', (t) => {
  t.plan(1)
  const sample = '2 + foo'
  const options = {
    context: {
      foo: 100
    }
  }

  const newSample = preprocess(sample, options)

  t.is(newSample, 'var foo = this["foo"];\n2 + foo')
})

test('should inject context into objects in sample', (t) => {
  t.plan(1)
  const sample = '2 + foo'
  const options = {
    context: {
      'console.log': function() {}
    }
  }

  const newSample = preprocess(sample, options)

  t.is(newSample, 'console.log = this["console.log"];\n2 + foo')
})

test('should remove call to `console.log()` in last expression', (t) => {
  t.plan(1)
  const sample = 'console.log(1)\nconsole.log(2)'
  const options = {}

  const newSample = preprocess(sample, options)

  t.is(newSample, 'console.log(1)\n2')
})

test('should remove variable declaration in last expression (var)', (t) => {
  t.plan(1)
  const sample = 'var a = 2 + 3'
  const options = {}

  const newSample = preprocess(sample, options)

  t.is(newSample, '2 + 3;') // Could not find out why it added a ';'
})
