'use strict'

const test = require('ava')

const processExamples = require('../../lib/processExamples')

test('should return an array of errors for the given list of examples', (t) => {
  t.plan(1)

  const options = { verbose: false }
  const examples = [{
    file: 'some-file.md',
    startLine: 100,
    code: [
      '2 + 3',
      '// => 5',
      '',
      '[2].concat(3)',
      '// => [2, 3]',
      '',
      'function add(a, b) { return a + b; }',
      'add(4, 5)',
      '// => 10'
    ].join('\n')
  }, {
    file: 'some-other-file.md',
    startLine: 200,
    code: [
      '100 * 3',
      '// => 300'
    ].join('\n')
  }]

  const errors = processExamples(options, examples)

  t.same(errors, ['some-file.md:108: add(4, 5)\nExpected 10 but got 9'])
})
