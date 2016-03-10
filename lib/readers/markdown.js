'use strict';

var fs = require('fs');

var _ = require('lodash/fp');

function zip(starts, ends) {
  return starts.reduce(function (res, start) {
    var end = _.find(function (val) {
      return val > start;
    }, ends);
    var newValue = [start, end];
    return [].concat(res, [newValue]);
  }, []);
}

function getLinesWith(lines, predicate) {
  return lines.reduce(function (res, line, index) {
    if (line === predicate) {
      return res.concat(index);
    }
    return res;
  }, []);
}

function findExamples(file, lines) {
  var exampleStarts = getLinesWith(lines, '```js');
  var exampleEnds = getLinesWith(lines, '```');

  return zip(exampleStarts, exampleEnds)
    .map(function (boundaries) {
      return {
        file: file,
        startLine: boundaries[0] + 1,
        code: lines.slice(boundaries[0] + 1, boundaries[1]).join('\n')
      };
    });
}

module.exports = function readFile(filePath, cb) {
  fs.readFile(filePath, 'utf8', function (error, data) {
    if (error) {
      return cb(error);
    }
    return cb(null, findExamples(filePath, data.split('\n')));
  });
};
