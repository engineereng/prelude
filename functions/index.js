const functions = require('firebase-functions');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Obtains Spotify Access Token using either refresh token or authorization code
// data should contain refresh_token or authorization_code
exports.obtainSpotifyToken = functions.https.onCall(async (data, context) => {
  const client_id_secret = '579c4604e4ba46608b8f47b906ec23fc:1ba3aed4a00340b799bfdf2e33b3e4dd';
  let buff = new Buffer(client_id_secret);
  const base_64_header = buff.toString('base64');

  if(data.authorization_code) {
    var http = new XMLHttpRequest();
    var url = 'https://accounts.spotify.com/api/token';
    var body = 'grant_type=authorization_code&code='+data.authorization_code+'&redirect_uri=https://prelude-nwhacks.web.app/spotify-token-redirect-uri'
    http.open('POST', url, false);
    http.setRequestHeader('Authorization', 'Basic '+base_64_header)
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(body);
    console.log(http.responseText);
    return(http.responseText);
  }

  if(data.refresh_token) {
    var http2 = new XMLHttpRequest();
    var url2 = 'https://accounts.spotify.com/api/token';
    var body2 = 'grant_type=refresh_token&refresh_token='+data.refresh_token;
    http2.open('POST', url2, false);
    http2.setRequestHeader('Authorization', 'Basic '+base_64_header);
    http2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http2.send(body2);
    console.log(http2.responseText);
    return(http2.responseText);
  }

  throw new functions.https.HttpsError('invalid-argument', 'Function was not called with authorization_code or refresh_token.');
});
