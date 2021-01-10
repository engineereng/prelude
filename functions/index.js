const functions = require('firebase-functions');
const admin = require('firebase-admin');
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
    var body = 'grant_type=authorization_code&code='+data.authorization_code+'&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Floggedin'
    http.open('POST', url, false);
    http.setRequestHeader('Authorization', 'Basic '+base_64_header)
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http.send(body);
    if(http.status === 200) {
      return(JSON.parse(http.responseText));
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
    http2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http2.send(body2);
    if(http2.status === 200) {
      return(JSON.parse(http2.responseText));
    } else {
      throw new functions.https.HttpsError('failed-return', 'Function returned with status ' + http.status);
    }
  }

  throw new functions.https.HttpsError('invalid-argument', 'Function was not called with authorization_code or refresh_token.');
});

// Takes user's info using auth token and generates user profile based on top tracks
// Requires Access Token (access_token) and Spotify user_id to be passed through
exports.generateProfileMetrics = functions.https.onCall((data, context) => {
  if(data.access_token && data.user_id) {
    var http = new XMLHttpRequest();
    var url = 'https://api.spotify.com/v1/me/top/tracks';
    var body = '?limit=50&time_range=long_term';
    http.open('GET', url+body);
    http.setRequestHeader('Authorization', 'Bearer ' + data.access_token);
    http.send();

    http.addEventListener('load', function() {
      if(this.status === 200) {
        console.log('Creating profile metrics...');
        var results = JSON.parse(this.responseText).items;

        var top_tracks = [];
        var top_artists = [];
        var metric_sums = {
          acousticness: 0,
          danceability: 0,
          energy: 0,
          instrumentalness: 0,
          liveness: 0,
          loudness: 0,
          speechiness: 0,
          tempo: 0,
          valence: 0,
          year: 0
        };

        var sum_metrics = results.map((track) => {
          top_tracks.push(track.id);
          track.artists.forEach(artist => {
            if(!top_artists.includes(artist.id)) {
              top_artists.push(artist.id);
            }
          });

          // TODO: Check if this works or if we need to convert to sync XMLHttpRequest
          admin.firebase.firestore().collection('spotify-songs').doc(track.id).get().then((doc) => {
            console.log(doc);
            metric_sums.acousticness += parseFloat(doc.acousticness);
            metric_sums.danceability += parseFloat(doc.danceability);
            metric_sums.energy += parseFloat(doc.energy);
            metric_sums.instrumentalness += parseFloat(doc.instrumentalness);
            metric_sums.liveness += parseFloat(doc.liveness);
            metric_sums.loudness += parseFloat(doc.loudness);
            metric_sums.speechiness += parseFloat(doc.speechiness);
            metric_sums.tempo += parseFloat(doc.tempo);
            metric_sums.valence += parseFloat(doc.valence);
            metric_sums.year += parseFloat(doc.year);

            return true;
          }).catch((err) => {console.log(err)});

          return true;
        });

        Promise.all(sum_metrics).then(() => {
          console.log(metric_sums);

          var avg_metrics = Object.keys(metric_sums).map((key, idx) => {
            metric_sums[idx] = parseFloat(metric_sums[idx])/parseFloat(top_tracks.length);
            return true;
          });

          return Promise.all(avg_metrics);
        }).then(() => {
          metric_sums.top_tracks = top_tracks;
          metric_sums.top_artists = top_artists;
          admin.firebase.firestore().collection('users').doc(data.user_id).update(metric_sums);
          return true;
        }).catch((err) => {console.log(err)});


      } else {
        console.log(this.status);
        throw new functions.https.HttpsError('failed-return', 'Function returned with status ' + this.status);
      }
    })

    return({result: 'In progress'});
  }

  throw new functions.https.HttpsError('invalid-argument', 'Function was not called with access_token and/or user_id.');
});

// Generate matches based on number requested.
