#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

var _ = require('lodash/fp');
var fs = require('fs');

var lib = require('../');
var argv = require('yargs')
  .config('config', function (configPath) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  })
  .argv;

function gracefulExit(errors) {
  if (errors) {
    if (!_.isArray(errors)) {
      console.error(errors.stack || errors);
    } else if (errors.length) {
      console.error(errors.join('\n\n'));
    }
  }
  process.exit(0);
}

var fileName = argv._[0];
lib.readers.markdown(fileName, function (error, examples) {
  if (error) {
    return gracefulExit(error);
  }
  gracefulExit(lib.processExamples(argv, examples));
});
