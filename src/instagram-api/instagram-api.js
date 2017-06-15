exports.userSelfMedia = function(accessToken) {
  var request = require('request');
  request('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      //console.log(info);
      return info;
    }
  })

}
