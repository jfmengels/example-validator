'use strict'

var recast = require('recast')

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

function removeConsoleLogInLastExpression (sample) {
  var ast = recast.parse(sample)
  var body = ast.program.body
  var lastExpression = body[body.length - 1]
  if (lastExpression.type === 'ExpressionStatement'
    && lastExpression.expression.type === 'CallExpression'
    && lastExpression.expression.callee.type === 'MemberExpression'
    && lastExpression.expression.callee.object.name === 'console'
    && lastExpression.expression.callee.property.name === 'log') {
    lastExpression.expression = lastExpression.expression.arguments[0]
  }
  return recast.print(ast).code
}

module.exports = function preprocess (sample, options) {
  return toInjectionCode(options.context, contextMapper) +
    toInjectionCode(options.dependencies, dependencyMapper) +
    removeConsoleLogInLastExpression(sample)
}
