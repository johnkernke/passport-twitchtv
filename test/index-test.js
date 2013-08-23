var vows = require('vows');
var assert = require('assert');
var util = require('util');
var twitchtv = require('passport-twitchtv');


vows.describe('passport-twitchtv').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(twitchtv.version);
    },
  },
  
}).export(module);
