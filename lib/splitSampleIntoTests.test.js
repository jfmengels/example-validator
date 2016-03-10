'use strict';

import test from 'ava';

import splitSampleIntoTests from './splitSampleIntoTests';

test('should split sample into multiple tests based on result comments', (t) => {
  const sample = [
    '2 + 3',
    '// => 5',
    '',
    '2 + "7"',
    '// => "27"'
  ].join('\n');

  const result = splitSampleIntoTests(sample);

  t.same(result, [{
    code: [
      '2 + 3'
    ].join('\n'),
    expected: 5
  }, {
    code: [
      '2 + 3',
      '// => 5',
      '',
      '2 + "7"'
    ].join('\n'),
    expected: '27'
  }]);
});

test('should ignore normal comments', (t) => {
  const sample = [
    '2 + 3',
    '// this should be 5',
    '',
    '2 + "7"',
    '// => "27"'
  ].join('\n');

  const result = splitSampleIntoTests(sample);

  t.same(result, [{
    code: [
      '2 + 3',
      '// this should be 5',
      '',
      '2 + "7"'
    ].join('\n'),
    expected: '27'
  }]);
});

test('should ignore code after last result comment', (t) => {
  const sample = [
    '2 + 3',
    '// => 5',
    '',
    '2 + "7"',
    '// this should be "27"'
  ].join('\n');

  const result = splitSampleIntoTests(sample);

  t.same(result, [{
    code: [
      '2 + 3'
    ].join('\n'),
    expected: 5
  }]);
});

test('should split only by real `\\n`', (t) => {
  const sample = [
    '"I\nam\non\nmultiple\nlines\n"// => 100',
    '2 + 3',
    '// => 5'
  ].join('\n');

  const result = splitSampleIntoTests(sample);

  t.same(result, [{
    code: [
      '"I\nam\non\nmultiple\nlines\n"// => 100',
      '2 + 3'
    ].join('\n'),
    expected: 5
  }]);
});

test('should write unreadable type when result comment is not evaluable', (t) => {
  const sample = [
    '2 + 3',
    '// => bla bla 5'
  ].join('\n');

  const result = splitSampleIntoTests(sample);

  t.same(result, [{
    code: '2 + 3',
    comment: 'bla bla 5',
    error: 'SyntaxError: Unexpected identifier',
    line: 1
  }]);
});
