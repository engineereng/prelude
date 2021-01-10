import './App.css';
import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';
import 'firebase/functions';
import {LandingPage, LoggedIn} from './pages/LandingPage/LandingPage';
import MainPage from './pages/MainPage/MainPage';
import NotLoggedIn from './pages/NotLoggedIn/NotLoggedIn';

import  {
  Redirect,
 // BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from 'react-router-dom';

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

//let db = firebase.firestore();
let functions = firebase.functions();

// Deal with emulators
if (window.location.hostname === 'localhost') {
  console.log('Localhost detected, using emulators...')
  firebase.firestore().useEmulator("localhost", 8080);
  firebase.functions().useEmulator("localhost", 5001);
}

function useQuery() {
  console.log(useLocation().pathname);
  return new URLSearchParams(useLocation().search);
}

function App() {
  let query = useQuery();

  return (
    <>

      <Route exact path="/" component= {LandingPage} />
      <Route path="/loggedin">
         <LoggedIn code={query.get("code")} functions={functions} />
      </Route>
      <Route path="/index">
       <MainPage data={query.get("code")} functions={functions} />
      </Route>
    </>
  );
}



export default App;
