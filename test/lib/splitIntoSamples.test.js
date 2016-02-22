'use strict'

var test = require('ava')

var splitIntoSamples = require('../../lib/splitIntoSamples')

test('should split sample into multiple tests based on result comments', function (t) {
  var sample = [
    '2 + 3',
    '// => 5',
    '',
    '2 + "7"',
    '// => "27"'
  ].join('\n')

  var result = splitIntoSamples(sample)

  t.same(result, [{
    code: [
      '2 + 3'
    ].join('\n'),
    expected: 5
  }, {
    code: [
      '2 + 3',
      '// => 5',
      '',
      '2 + "7"'
    ].join('\n'),
    expected: '27'
  }])
})

test('should ignore normal comments', function (t) {
  var sample = [
    '2 + 3',
    '// this should be 5',
    '',
    '2 + "7"',
    '// => "27"'
  ].join('\n')

  var result = splitIntoSamples(sample)

  t.same(result, [{
    code: [
      '2 + 3',
      '// this should be 5',
      '',
      '2 + "7"'
    ].join('\n'),
    expected: '27'
  }])
})

test('should ignore code after last result comment', function (t) {
  var sample = [
    '2 + 3',
    '// => 5',
    '',
    '2 + "7"',
    '// this should be "27"'
  ].join('\n')

  var result = splitIntoSamples(sample)

  t.same(result, [{
    code: [
      '2 + 3'
    ].join('\n'),
    expected: 5
  }])
})

test('should split only by real `\\n`', function (t) {
  var sample = [
    '"I\nam\non\nmultiple\nlines\n"// => 100',
    '2 + 3',
    '// => 5'
  ].join('\n')

  var result = splitIntoSamples(sample)

  t.same(result, [{
    code: [
      '"I\nam\non\nmultiple\nlines\n"// => 100',
      '2 + 3'
    ].join('\n'),
    expected: 5
  }])
})

test('should write unreadable type when result comment is not evaluable', function (t) {
  var sample = [
    '2 + 3',
    '// => bla bla 5'
  ].join('\n')

  var result = splitIntoSamples(sample)

  t.same(result, [{
    code: '2 + 3',
    error: 'SyntaxError: Unexpected identifier',
    comment: 'bla bla 5'
  }])
})
