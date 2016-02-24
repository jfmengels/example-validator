'use strict'

var _ = require('lodash/fp')

var describeError = require('./describeError')
var validate = require('./validate')

module.exports = function processExamples(options, examples) {
  return _.flow(
    _.map(function(example) {
      return validate(options, example)
    }),
    _.flatten,
    _.map(describeError({}))
  )(examples)
}
