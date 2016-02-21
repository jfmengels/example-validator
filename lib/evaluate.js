'use strict'
/*eslint no-eval: 0*/

function contextMapper () {
  return function (key) {
    return 'var ' + key + ' = this.' + key
  }
}

function dependencyMapper (dependencies) {
  return function (key) {
    var dependency = dependencies[key]
    var propertyName = dependencies[key].property || ''
    var property = propertyName && '.' + propertyName
    return 'var ' + key + ' = require("' + dependency.path + '")' + property
  }
}

function toInjectionCode (object, mapper) {
  var injection = Object.keys(object || {})
    .map(mapper(object))
    .join('\n')

  return injection && injection + '\n'
}
function evalInContext (js, context) {
  return function () {
    return eval(js)
  }.call(context)
}

module.exports = function evaluate (sample, options) {
  var finalSample = toInjectionCode(options.context, contextMapper) +
    toInjectionCode(options.dependencies, dependencyMapper) +
    sample

  try {
    return evalInContext(finalSample, options.context)
  } catch (error) {
    return error.toString()
  }
}
