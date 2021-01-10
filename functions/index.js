const functions = require('firebase-functions');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Obtains Spotify Access Token using either refresh token or authorization code
// data should contain refresh_token or authorization_code
exports.obtainSpotifyToken = functions.https.onCall((data, context) => {
  const client_id_secret = '579c4604e4ba46608b8f47b906ec23fc:1ba3aed4a00340b799bfdf2e33b3e4dd';
  let buff = new Buffer(client_id_secret);
  const base_64_header = buff.toString('base64');

  if(data.authorization_code) {
    var http = new XMLHttpRequest();
    var url = 'https://accounts.spotify.com/api/token';
    var body = 'grant_type=authorization_code&code='+data.authorization_code+'&redirect_uri=http://localhost:3000/loggedin'
    http.open('POST', url, false);
    http.setRequestHeader('Authorization', 'Basic '+base_64_header)
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(body);
    if(this.status === 200) {
      return(http.responseText);
    } else {
      throw new functions.https.HttpsError('failed-return', 'Function returned with status ' + http.status);
    }
  }

  if(data.refresh_token) {
    var http2 = new XMLHttpRequest();
    var url2 = 'https://accounts.spotify.com/api/token';
    var body2 = 'grant_type=refresh_token&refresh_token='+data.refresh_token;
    http2.open('POST', url2, false);
    http2.setRequestHeader('Authorization', 'Basic '+base_64_header);
    http2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http2.send(body2);
    if(this.status === 200) {
      return(http.responseText);
    } else {
      throw new functions.https.HttpsError('failed-return', 'Function returned with status ' + http.status);
    }
  }

  throw new functions.https.HttpsError('invalid-argument', 'Function was not called with authorization_code or refresh_token.');
});

// Takes user's info using auth token and generates user profile based on top tracks
// Requires Authentication Token (auth_token) to be passed through
exports.generateProfileMetrics = functions.https.onCall((data, context) => {
  if(data.auth_token) {
    var http = new XMLHttpRequest();
    var url = 'https://api.spotify.com/v1/me/top/tracks';
    var body = 'limit=50&time_range=long_term';
    http.open('GET', url);
    http.setRequestHeader('Authorization', data.auth_token);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(body);

    http.addEventListener('load', () => {
      console.log(this.responseText);
    })
  }

  throw new functions.https.HttpsError('invalid-argument', 'Function was not called with an auth_token.');
});
