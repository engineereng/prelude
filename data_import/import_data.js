const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/analytics');
require('firebase/functions');

const csv = require('csv-parser');
const fs = require('fs');

const firebaseConfig = {
  apiKey: "AIzaSyAMtcfzOanNakfh0O6h1vUkmM8c6g9-v4s",
  authDomain: "prelude-nwhacks.firebaseapp.com",
  projectId: "prelude-nwhacks",
  storageBucket: "prelude-nwhacks.appspot.com",
  messagingSenderId: "349466284705",
  appId: "1:349466284705:web:0067e137e78f9846df16e0",
  measurementId: "G-RMJ4P8LD48"
};

// Initialize Firebase & Firestore
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

fs.createReadStream('spotify-songs.csv')
  .pipe(csv())
  .on('data', (row) => {
    db.collection('spotify-songs').doc(row.id).set(row);
  })
  .on('end', () => {
    console.log('Done.');
  });
