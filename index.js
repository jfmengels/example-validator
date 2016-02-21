'use strict';

module.exports = function validate(sample, context) {
  var result = eval(sample)
  console.log(result);
  return {ok: true}
}
