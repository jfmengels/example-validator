'use strict'
/*eslint no-eval: 0*/

var preprocess = require('./preprocessSample')

function evalInContext (js, context) {
  return function () {
    return eval(js)
  }.call(context)
}

module.exports = function evaluate (sample, options) {
  try {
    return evalInContext(preprocess(sample, options), options.context)
  } catch (error) {
    return error.toString()
  }
}
