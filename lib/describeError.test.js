'use strict';

import test from 'ava';

import describeError from './describeError';

const mockError = {
  code: `
    1 + 2
    // => 3
    "a" + "b"
  `,
  expected: 'abc',
  expression: '"a" + "b"',
  file: '/some/file.md',
  got: 'ab',
  line: 81
};

const mockParseError = {
  code: `
    1 + 2
    // => 3
    "a" =+ "b"
  `,
  expected: 'abc',
  expression: '"a" + "b"',
  error: 'SyntaxError: Unexpected token =',
  errorType: 'parse',
  file: '/some/file.md',
  got: 'ab',
  line: 81
};

test('should describe unexpected result error', (t) => {
  const options = {verbose: false};
  const error = mockError;

  const description = describeError(options, error);

  t.same(description, [
    '/some/file.md:81: "a" + "b"',
    'Expected "abc" but got "ab"'
  ].join('\n'));
});

test('should describe unexpected result error in more details with verbose mode', (t) => {
  const options = {verbose: true};
  const error = mockError;

  const description = describeError(options, error);

  t.same(description, [
    '/some/file.md:81: "a" + "b"',
    'Expected "abc" but got "ab"',
    'Near:',
    error.code
  ].join('\n'));
});

test('should describe parsing error', (t) => {
  const options = {verbose: false};
  const error = mockParseError;

  const description = describeError(options, error);

  t.same(description, 'Could not parse result comment: SyntaxError: Unexpected token =');
});

test('should describe parsing error in more details with verbose mode', (t) => {
  const options = {verbose: true};
  const error = mockParseError;

  const description = describeError(options, error);

  t.same(description, [
    'Could not parse result comment: SyntaxError: Unexpected token =',
    'Near:',
    error.code
  ].join('\n'));
});
