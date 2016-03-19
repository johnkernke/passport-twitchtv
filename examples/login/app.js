var bodyParser   = require('body-parser')
  , cookieParser = require('cookie-parser')
  , engine       = require('ejs-locals')
  , express = require('express')
  , passport = require('passport')
  , session      = require('express-session')
  , TwitchtvStrategy = require('passport-twitchtv/lib/passport-twitchtv/index').Strategy;

var TWITCHTV_CLIENT_ID = "--insert-twitchtv-client-id-here--";
var TWITCHTV_CLIENT_SECRET = "--insert-twitchtv-client-secret-here--";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Twitch.tv profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the TwitchtvStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a accessToken, refreshToken, Twitch.tv profile, and scope required),
//   and invoke a callback with a user object.
passport.use(new TwitchtvStrategy({
    clientID: TWITCHTV_CLIENT_ID,
    clientSecret: TWITCHTV_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitchtv/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {

    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Twitch.tv profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitch.tv account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


var app = express();

// configure Express
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/twitchtv
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Twitch.tv authentication will involve
//   redirecting the user to Twitch.tv.  After authorization, Twitch.tv will
//   redirect the user back to this application at /auth/twitchtv/callback
app.get('/auth/twitchtv',
  passport.authenticate('twitchtv', { scope: [ 'user_read' ] }),
  function(req, res){
    // The request will be redirected to Twitch.tv for authentication, so this
    // function will not be called.
  });

// GET /auth/twitchtv/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/twitchtv/callback',
  passport.authenticate('twitchtv', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
