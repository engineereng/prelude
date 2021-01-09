import './App.css';

import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';
import LandingPage from './pages/LandingPage.js';

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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
};

let db = firebase.firestore();
console.log(db);

// Deal with emulators
if (window.location.hostname === 'localhost') {
  console.log('Localhost detected, using emulators...')
  firebase.firestore().useEmulator("localhost", 8080);
}

function App() {
  return (
    <LandingPage />
  );
}

export default App;
