'use strict'

var _ = require('lodash/fp')
var recast = require('recast')

function contextMapper () {
  return function (key) {
    var varDeclaration = key.indexOf('.') === -1 ? 'var ' : ''
    return varDeclaration + key + ' = this["' + key + '"];'
  }
}

function dependencyMapper (dependencies) {
  return function (key) {
    var dependency = dependencies[key]
    var propertyName = dependencies[key].property || ''
    var property = propertyName && '.' + propertyName
    return 'var ' + key + ' = require("' + dependency.path + '")' + property + ';'
  }
}

function toInjectionCode (object, mapper) {
  var injection = Object.keys(object || {})
    .map(mapper(object))
    .join('\n')

  return injection && injection + '\n'
}

function removeConsoleLog(node) {
  if (node.type === 'ExpressionStatement'
    && node.expression.type === 'CallExpression'
    && node.expression.callee.type === 'MemberExpression'
    && node.expression.callee.object.name === 'console'
    && node.expression.callee.property.name === 'log') {
    return {
      type:'ExpressionStatement',
      expression: node.expression.arguments[0]
    }
  }
  return node
}

function removeAssignment(node) {
  if (node.type === 'VariableDeclaration') {
    return recast.types.builders.expressionStatement(
      node.declarations[0].init
    )
  }
  return node
}

function removeConsoleLogInLastExpression (sample) {
  var ast = recast.parse(sample)
  var body = ast.program.body
  var node = body[body.length - 1]

  body[body.length - 1] = _.flow(
    removeConsoleLog,
    removeAssignment
  )(node)

  return recast.print(ast).code
}

module.exports = function preprocess (sample, options) {
  return toInjectionCode(options.context, contextMapper) +
    toInjectionCode(options.dependencies, dependencyMapper) +
    removeConsoleLogInLastExpression(sample)
}
