'use strict';

import test from 'ava';
import path from 'path';

const validate = require('./validate');

test('should validate sample where result is matching', (t) => {
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      '2 + 3',
      '// => 5'
    ].join('\n')
  };

  const result = validate({}, sample);

  t.same(result, []);
});

test('should validate sample where result is matching and needs deep-equality checking', (t) => {
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      '[2].concat(3)',
      '// => [2, 3]'
    ].join('\n')
  };

  const result = validate({}, sample);

  t.same(result, []);
});

test('should throw an error when sample is not valid', (t) => {
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      '2 + 3',
      '// => 6'
    ].join('\n')
  };

  const result = validate({}, sample);

  t.same(result, [{
    file: '/some/path.md',
    code: '2 + 3',
    expected: 6,
    expression: '2 + 3',
    got: 5,
    line: 85
  }]);
});

test('should throw an error when error is thrown in sample', (t) => {
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      'const a = {}',
      'a.getUnknownMethod()',
      '// => 6'
    ].join('\n')
  };

  const result = validate({}, sample);

  t.same(result, [{
    file: '/some/path.md',
    code: [
      'const a = {}',
      'a.getUnknownMethod()'
    ].join('\n'),
    expected: 6,
    expression: 'a.getUnknownMethod()',
    got: 'TypeError: a.getUnknownMethod is not a function',
    line: 86
  }]);
});

test('should validate when error is expected', (t) => {
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      'const a = {}',
      'a.getUnknownMethod()',
      '// => "TypeError: a.getUnknownMethod is not a function"'
    ].join('\n')
  };

  const result = validate({}, sample);

  t.same(result, []);
});

test('should throw an error when assert fails in sample', (t) => {
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      'const assert = require("assert")',
      'assert.equal(1, 2)',
      '// => "AssertionError: 1 == 2"'
    ].join('\n')
  };

  const result = validate({}, sample);

  t.same(result, []);
});

test('should be able to inject context in sample', (t) => {
  const context = {
    lib: {
      return6: () => 6
    }
  };
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      'lib.return6()',
      '// => 6'
    ].join('\n')
  };

  const result = validate({context: context}, sample);

  t.same(result, []);
});

test('should be able to inject dependencies in sample', (t) => {
  const dependencies = {
    timesThree: {
      path: path.join(__dirname, '../test-fixtures/timesThree')
    }
  };
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      'timesThree(3)',
      '// => 9'
    ].join('\n')
  };

  const result = validate({dependencies: dependencies}, sample);

  t.same(result, []);
});

test('should be able to inject property of a dependency in sample', (t) => {
  const dependencies = {
    timesFour: {
      path: path.join(__dirname, '../test-fixtures/timesThree'),
      property: 'timesFour'
    }
  };
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      'timesFour(3)',
      '// => 12'
    ].join('\n')
  };

  const result = validate({dependencies: dependencies}, sample);

  t.same(result, []);
});

test('should fail when result comment is not evaluable', (t) => {
  const sample = {
    file: '/some/path.md',
    startLine: 84,
    code: [
      '2 + 3',
      '// => bla bla 5'
    ].join('\n')
  };

  const result = validate({}, sample);

  t.same(result, [{
    file: '/some/path.md',
    code: '2 + 3',
    error: 'SyntaxError: Unexpected identifier',
    comment: 'bla bla 5',
    line: 85
  }]);
});
