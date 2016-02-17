'use strict';

const test = require('tape');

test('does it say hello?', function(t) {
  let myStuff = require('../lib');
  let result = myStuff();
  t.equal(result, 'Hello, World!');
  t.end();  
});
