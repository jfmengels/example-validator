'use strict'

var evaluate = require('./evaluate')
var splitIntoSamples = require('./splitIntoSamples')

function compact (values) {
  return values.filter(function (val) { return val })
}

module.exports = function validate (sample, options) {
  return compact(
    splitIntoSamples(sample)
    .map(function (part) {
      var result = evaluate(part.code, options || {})
      if (result === part.expected) {
        return
      }

      var lines = part.code.split('\n')
      return {
        code: part.code,
        expected: part.expected,
        expression: lines[lines.length - 1],
        got: result,
        line: lines.length
      }
    })
  )
}
