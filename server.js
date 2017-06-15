var express = require('express');
var app = express();
var $ = require('jQuery');
var api = require('instagram-node').instagram();

//var instagramAPI = require('./src/instagram-api/instagram-api');
// oprobin : 2733309.11c398a.82323294a73e4a919981e3b2b6bf4acc
// robinopra : 3224122491.0a08539.4dcf491c6a6e4a33aeecb65e5316adb3
var accessToken = '';
var InstagramAPI = require('instagram-api');
var instagramAPI = new InstagramAPI(accessToken);

api.use({client_id: '11c398a0528e4508bc02388bdd22981f', client_secret: 'eeef1058a1c540ae83ba4844273413b3'});

var redirect_uri = 'http://localhost:8081/handleauth';
exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, {
    scope: ['likes'],
    state: 'a state'
  }));
};

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      api.use({access_token: result.access_token});
      localStorage.setItem('access_token', result.access_token)
      //res.send('You made it!!');
      res.redirect('/');
    }
  });
};
// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/handleauth', exports.handleauth);

app.get('/', function(req, res) {
  if (localStorage.getItem('access_token')) {
    api.use({access_token: localStorage.getItem('access_token')});
  }
  api.user_self_media_recent([], function(err, medias, pagination, remaining, limit) {
    console.log(err);
    console.log(remaining);
    console.log(limit);
    //console.log(medias);
    res.render('HomePage.ejs', {imgList: medias});
  });
})

app.get('/carousel', function(req, res) {
  if (localStorage.getItem('access_token')) {
    api.use({access_token: localStorage.getItem('access_token')});
  }
  api.user_self_media_recent([], function(err, medias, pagination, remaining, limit) {
    res.render('Carousel.ejs', {imgList: medias});
  });
})
app.use(function(req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send('Page introuvable !');
});

var server = app.listen(8081, function() {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})
