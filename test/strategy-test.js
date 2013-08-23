var vows = require('vows');
var assert = require('assert');
var util = require('util');
var TwitchtvStrategy = require('passport-twitchtv/strategy');


vows.describe('TwitchtvStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new TwitchStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
    },
    
    'should be named twitchtv': function (strategy) {
      assert.equal(strategy.name, 'twitchtv');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new twitchStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        var body = '{ \
           "image_url_huge": "http:\/\/static-cdn.justin.tv\/jtv_user_pictures\/justin-320x240-4.jpg", \
           "profile_header_border_color": null, \
           "favorite_quotes": "I love Justin.tv", \
           "sex": "Male", \
           "image_url_large": "http:\/\/static-cdn.justin.tv\/jtv_user_pictures\/justin-125x94-4.jpg", \
           "profile_about": "Check out my website: www.justin.tv", \
           "profile_background_color": null, \
           "image_url_medium": "http:\/\/static-cdn.justin.tv\/jtv_user_pictures\/justin-75x56-4.jpg", \
           "id": 1698, \
           "broadcaster": true, \
           "profile_url": "http:\/\/www.justin.tv\/justin\/profile", \
           "profile_link_color": null, \
           "image_url_small": "http:\/\/static-cdn.justin.tv\/jtv_user_pictures\/justin-50x37-4.jpg", \
           "profile_header_text_color": null, \
           "name": "The JUST UN", \
           "image_url_tiny": "http:\/\/static-cdn.justin.tv\/jtv_user_pictures\/justin-33x25-4.jpg", \
           "login": "justin", \
           "profile_header_bg_color": null, \
           "location": "San Francisco" \
          }';
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'twitchtv');
        assert.equal(profile.id, '1698');
        assert.equal(profile.username, 'twitch');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new TwitchtvStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        callback(new Error('something went wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },

}).export(module);
