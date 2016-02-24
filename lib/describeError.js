'use strict'

var _ = require('lodash/fp')

function describeParseError(error) {
  return ['Could not parse result comment: ' + error.error]
}

function describeUnexpectedResult(error) {
  return [
    error.file + ':' + error.line + ': ' + error.expression,
    'Expected ' + JSON.stringify(error.expected) + ' but got ' + JSON.stringify(error.got)
  ]
}

function describeError(options, error) {
  var lines = error.error ?
    describeParseError(error) :
    describeUnexpectedResult(error)

  if (options.verbose) {
    lines = lines.concat(
      'Near:',
      error.code
    )
  }
  return lines.join('\n')
}

module.exports = _.curry(describeError)
