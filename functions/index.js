const functions = require('firebase-functions');
const admin = require('firebase-admin');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

admin.initializeApp();

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
    if(http.status >= 200 && http.status < 300) {
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
    if(http2.status >= 200 && http2.status < 300) {
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
  const number_tracks = 50;

  if(data.access_token && data.user_id) {
    var http = new XMLHttpRequest();
    var url = 'https://api.spotify.com/v1/me/top/tracks';
    var body = '?limit='+number_tracks.toString()+'&time_range=long_term';
    http.open('GET', url+body);
    http.setRequestHeader('Authorization', 'Bearer ' + data.access_token);
    http.send();

    http.addEventListener('load', function() {
      if(this.status >= 200 && this.status < 300) {
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
          valence: 0
        };

        var compile_tracks = results.map((track) => {
          top_tracks.push(track.id);
          track.artists.forEach(artist => {
            if(!top_artists.includes(artist.id)) {
              top_artists.push(artist.id);
            }
          });

          return true;
        });

        Promise.all(compile_tracks).then(() => {
          var http2 = new XMLHttpRequest();
          var url = 'https://api.spotify.com/v1/audio-features';
          var body = '?ids='+top_tracks.join('%2C');
          http2.open('GET', url+body, false);
          http2.setRequestHeader('Authorization', 'Bearer ' + data.access_token);
          http2.send();
          if(http2.status >= 200 && http2.status < 300) {
            var metrics = JSON.parse(http2.responseText).audio_features;

            var sum_metrics = metrics.map((metric) => {
              metric_sums.acousticness += parseFloat(metric.acousticness);
              metric_sums.danceability += parseFloat(metric.danceability);
              metric_sums.energy += parseFloat(metric.energy);
              metric_sums.instrumentalness += parseFloat(metric.instrumentalness);
              metric_sums.liveness += parseFloat(metric.liveness);
              metric_sums.loudness += parseFloat(metric.loudness);
              metric_sums.speechiness += parseFloat(metric.speechiness);
              metric_sums.tempo += parseFloat(metric.tempo);
              metric_sums.valence += parseFloat(metric.valence);

              return true;
            });

            return Promise.all(sum_metrics);
          } else {
            console.log(this.status);
            throw new functions.https.HttpsError('failed-return', 'Function returned with status ' + this.status);
          }
        }).then(() => {
          var avg_metrics = Object.keys(metric_sums).map((key, idx) => {
            metric_sums[key] = parseFloat(metric_sums[key])/parseFloat(top_tracks.length);
            return true;
          });

          return Promise.all(avg_metrics);
        }).then(() => {
          metric_sums.top_tracks = top_tracks;
          metric_sums.top_artists = top_artists;
          return admin.firestore().collection('users').doc(data.user_id.toString()).update(metric_sums);
        }).catch(err => {console.log(err)})
      } else {
        console.log(this.status);
        throw new functions.https.HttpsError('failed-return', 'Function returned with status ' + this.status);
      }
    })

    return({result: 'In progress'});
  }

  throw new functions.https.HttpsError('invalid-argument', 'Function was not called with access_token and/or user_id.');
});

// Generate matches based on number requested
// Takes user_id and number of matches (num) desired
exports.matchUser = functions.https.onCall((data, context) => {
  // Shouldn't compare against all other users in production, but we'll do it for POC
  var metric_scores = {};
  var final_scores = [];
  return admin.firestore().collection('users').get().then((snapshot) => {
    var users = snapshot.docs;
    var current_user_metrics = users.filter((val, idx, arr) => {return val.id === data.user_id.toString()})[0].data();

    for (var i=0; i<users.length; i++) {
      if(users[i].id === data.user_id.toString()) {
        users.splice(i, 1);
      }
    }

    console.log(users);

    var calc_metric_scores = snapshot.docs.map((user) => {
      var user_metrics = user.data();

      metric_scores[user.id] = {
        acousticness: 1/Math.abs(current_user_metrics.acousticness - user_metrics.acousticness),
        danceability: 1/Math.abs(current_user_metrics.danceability - user_metrics.danceability),
        energy: 1/Math.abs(current_user_metrics.energy - user_metrics.energy),
        instrumentalness: 1/Math.abs(current_user_metrics.instrumentalness - user_metrics.instrumentalness),
        liveness: 1/Math.abs(current_user_metrics.liveness - user_metrics.liveness),
        speechiness: 1/Math.abs(current_user_metrics.speechiness - user_metrics.speechiness),
        tempo: 1/Math.abs(current_user_metrics.tempo - user_metrics.tempo),
        valence: 1/Math.abs(current_user_metrics.valence - user_metrics.valence)
      }

      final_scores.push({user: user.id, score: metric_scores[user.id].acousticness + metric_scores[user.id].danceability + metric_scores[user.id].energy + metric_scores[user.id].instrumentalness + metric_scores[user.id].liveness + metric_scores[user.id].speechiness + metric_scores[user.id].tempo + metric_scores[user.id].valence});

      return true;
    })

    return Promise.all(calc_metric_scores);
  }).then(() => {
    console.log(metric_scores);
    console.log(final_scores);
    final_scores.sort((a,b) => {
      if (a.sum > b.sum) {
        return -100;
      } else {
        return 100;
      }
    })

    console.log(metric_scores);
    return final_scores.filter((val, idx, arr) => {
      return idx <= data.num
    });
  }).catch((err) => {console.log(err)})
});
