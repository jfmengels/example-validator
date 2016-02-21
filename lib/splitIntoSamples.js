'use strict'
/*eslint no-eval: 0*/
var resultCommentRegexp = /^\s*\/\/ => (.*)$/

function getResultCommentLines (lines) {
  return lines
    .map(function (line, index) {
      return resultCommentRegexp.test(line) ? index : -1
    })
    .filter(function (lineIndex) {
      return lineIndex > -1
    })
}

module.exports = function splitIntoSamples (sample) {
  var sampleLines = sample.split('\n')

  var commentLineIndexes = getResultCommentLines(sampleLines)

  return commentLineIndexes.map(function (lineIndex) {
    var expected = eval(resultCommentRegexp.exec(sampleLines[lineIndex])[1])
    return {
      code: sampleLines.slice(0, lineIndex).join('\n'),
      expected: expected
    }
  })
}
