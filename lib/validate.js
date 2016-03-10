'use strict';

var _ = require('lodash/fp');

var evaluate = require('./evaluate');
var splitSampleIntoTests = require('./splitSampleIntoTests');

var evaluatePart = _.curry(function (options, sample, part) {
  if (part.error) {
    return _.assign(part, {
      line: sample.startLine + part.line,
      file: sample.file
    });
  }

  var result = evaluate(part.code, options);
  if (_.isEqual(result, part.expected)) {
    return;
  }

  var lines = part.code.split('\n');
  return {
    code: part.code,
    expected: part.expected,
    expression: lines[lines.length - 1],
    got: result,
    line: sample.startLine + lines.length,
    file: sample.file
  };
});

var oldConsoleLog = console.log;
var oldProcessExit = process.exit;

// Restores the use of console.log, etc., that were assigned in the evaluation
var restoreDefaults = function () {
  console.log = oldConsoleLog;
  process.exit = oldProcessExit;
};

var defaultOptions = {
  context: {
    'console.log': function () {},
    'process.exit': function () {}
  }
};

module.exports = function validate(options, sample) {
  var result = _.flow(
    splitSampleIntoTests,
    _.map(evaluatePart(_.merge(defaultOptions, options), sample)),
    _.compact
  )(sample.code);

  restoreDefaults();

  return result;
};
