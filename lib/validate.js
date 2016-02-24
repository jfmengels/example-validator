'use strict'

var _ = require('lodash/fp')

var evaluate = require('./evaluate')
var splitIntoSamples = require('./splitIntoSamples')

var evaluatePart = _.curry(function (options, sample, part) {
  if (part.error) {
    return _.assign(part, {
      line: sample.startLine + part.line,
      file: sample.file
    })
  }

  var result = evaluate(part.code, options || {})
  if (_.isEqual(result, part.expected)) {
    return
  }

  var lines = part.code.split('\n')
  return {
    code: part.code,
    expected: part.expected,
    expression: lines[lines.length - 1],
    got: result,
    line: sample.startLine + lines.length,
    file: sample.file
  }
})

module.exports = function validate (options, sample) {
  return _.flow(
    splitIntoSamples,
    _.map(evaluatePart(options, sample)),
    _.compact
  )(sample.code)
}
