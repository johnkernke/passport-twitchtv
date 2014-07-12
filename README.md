# Passport-Twitch.tv

[![Build Status](https://secure.travis-ci.org/johnkernke/passport-twitchtv.png)](http://travis-ci.org/johnkernke/passport-twitchtv)

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Twtich.tv](http://www.twitch.tv/) using the OAuth 2.0 API.

This module lets you authenticate using Twitch.tv in your Node.js applications.
By plugging into Passport, Twitch.tv authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-twitchtv

## Usage

#### Configure Strategy

The Twitch.tv authentication strategy authenticates users using a Twitch.tv
account and OAuth tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a consumer key, consumer secret, and callback URL.

A `scope` is required, all scopes are [available here](https://github.com/justintv/Twitch-API/blob/master/authentication.md#scopes)

```javascript
passport.use(new TwitchtvStrategy({
    clientID: TWITCHTV_CLIENT_ID,
    clientSecret: TWITCHTV_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitchtv/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ twitchtvId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'twitchtv'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/twitchtv', passport.authenticate('twitchtv'));

app.get('/auth/twitchtv/callback', 
  passport.authenticate('twitchtv', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
```

## Examples

For a complete, working example, refer to the [login example](https://github.com/johnkernke/passport-twitchtv/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/johnkernke/passport-twitchtv.png)](http://travis-ci.org/johnkernke/passport-twitchtv)

## Credits

  - [John Kernke](http://github.com/johnkernke)
  - [Jared Hanson](http://github.com/jaredhanson) (Used [passport-justintv](https://github.com/jaredhanson/passport-justintv) as a base to work off)
  - [Fergus Leen](https://github.com/thgil) (Added displayName to profile)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 John Kernke
