'use strict';
/* eslint no-eval: 0*/
var resultCommentRegexp = /^\s*\/\/ => (.*)$/;

function getResultCommentLines(lines) {
  return lines
    .map(function (line, index) {
      return resultCommentRegexp.test(line) ? index : -1;
    })
    .filter(function (lineIndex) {
      return lineIndex > -1;
    });
}

module.exports = function splitSampleIntoTests(sample) {
  var sampleLines = sample.split('\n');

  var commentLineIndexes = getResultCommentLines(sampleLines);

  return commentLineIndexes.map(function (lineIndex) {
    var code = sampleLines.slice(0, lineIndex).join('\n');
    var resultComment = resultCommentRegexp.exec(sampleLines[lineIndex])[1];
    try {
      return {
        code: code,
        expected: eval(resultComment)
      };
    } catch (error) {
      return {
        code: code,
        comment: resultComment,
        error: error.toString(),
        line: lineIndex
      };
    }
  });
};
