'use strict'
/*eslint no-eval: 0*/

var splitIntoSamples = require('./lib/splitIntoSamples')

function evalInContext (js, context) {
  return function () {
    return eval(js)
  }.call(context)
}

function contextMapper () {
  return function (key) {
    return 'var ' + key + ' = this.' + key
  }
}

function dependencyMapper (dependencies) {
  return function (key) {
    return 'var ' + key + ' = require("' + dependencies[key] + '")'
  }
}

function toInjectionCode (object, mapper) {
  var injection = Object.keys(object || {})
    .map(mapper(object))
    .join('\n')

  return injection && injection + '\n'
}

function evaluate (sample, options) {
  var finalSample = toInjectionCode(options.context, contextMapper) +
    toInjectionCode(options.dependencies, dependencyMapper) +
    sample

  try {
    return evalInContext(finalSample, options.context)
  } catch (error) {
    return error.toString()
  }
}

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
