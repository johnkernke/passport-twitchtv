var vows = require('vows');
var assert = require('assert');
var util = require('util');
var TwitchtvStrategy = require('passport-twitchtv/strategy');


vows.describe('TwitchtvStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new TwitchtvStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named twitchtv': function (strategy) {
      assert.equal(strategy.name, 'twitchtv');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new TwitchtvStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        var body = '{ \
            "name": "test_user1", \
            "created_at": "2011-06-03T17:49:19Z", \
            "updated_at": "2012-06-18T17:19:57Z", \
            "_links": { \
              "self": "https:\/\/api.twitch.tv\/kraken\/users\/test_user1" \
            }, \
            "logo": "http:\/\/static-cdn.jtvnw.net\/jtv_user_pictures\/test_user1-profile_image-62e8318af864d6d7-300x300.jpeg", \
            "_id": 22761313, \
            "display_name": "test_user1", \
            "email": "asdf@asdf.com", \
            "partnered": true \
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
          strategy.userProfile('accessToken', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'twitchtv');
        assert.equal(profile.id, '22761313');
        assert.equal(profile.username, 'test_user1');
        assert.equal(profile.displayName, 'test_user1');
        assert.equal(profile.email, 'asdf@asdf.com');
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
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
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
          strategy.userProfile('accessToken', done);
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
