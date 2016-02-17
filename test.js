'use strict';

const join = require('path').join;
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const test = require('tape');

const files = [
  '.editorconfig',
  '.git',
  '.gitattributes',
  '.gitignore',
  'index.js',
  'license',
  'package.json',
  'readme.md',
  'lib/index.js',
  'test/test.js'
];

test('files are created', function (t) {

  // borrowed from generator-rise
  helpers.run(join(__dirname, '/app'))
  .withOptions({ skipInstall: true })
  .withPrompts({ someOption: true })
  .on('end', () => {
    t.doesNotThrow( function() { assert.file(files); } );
    t.end();
  });
});
