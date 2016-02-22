'use strict'

var path = require('path')
var test = require('ava')

var readMarkdown = require('../../../lib/readers').markdown
var validate = require('../../../lib/validate')

test.cb('should extract the examples from a Markdown file', function(t) {
  var pathToFixture = path.join(__dirname, '../../fixtures/markdown-file.md')

  readMarkdown(pathToFixture, function(res, examples) {
    t.same(examples, [
      [
        '2 + 3',
        '// => 5',
        '',
        '[2].concat(3)',
        '// => [2, 3]',
        '',
        'function add(a, b) { return a + b; }',
        'add(4, 5)',
        '// => 9'
      ].join('\n'),
      [
        '100 * 3',
        '// => 300'
      ].join('\n')
    ])
    t.end()
  })
})
