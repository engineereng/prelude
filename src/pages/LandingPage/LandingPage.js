import React, { Component } from "react";
import "./LandingPage.css";
import 'antd/dist/antd.css';
import eighthNote from '../../assets/eighth-note.png';
import doubleEighthNote from '../../assets/double-eighth-note.png';
import logo from '../../assets/prelude-logo.png';
import spinner from '../../assets/Spinner-1s-200px.gif';
import  {
  Redirect,
} from 'react-router-dom';

// import firebase from 'firebase/app';
// import 'firebase/functions';

class LandingPage extends Component {
  signin = () => { // redirects the user to Spotify to authenticate
    var clientId = "579c4604e4ba46608b8f47b906ec23fc";
    var uri = "http%3A%2F%2F" + "localhost%3A3000" + "%2Floggedin";
    window.location.assign('https://accounts.spotify.com/authorize'+'?client_id=' + clientId + "&"
     + 'response_type=code' + '&'
     + 'redirect_uri=' + uri + '&'
     + 'scope=' + "user-top-read");
  }

  componentDidMount() {
    document.title = "prelude - the beginning of your next chapter";
  }

  render() {

    return (
            <div>
              <div className="App">
                <img alt="prelude logo" src={logo} id="logo" />
                <p id="left">
                  <h1>prelude</h1>
                  <p id="tagline">the beginning of your next chapter</p>
                  <p id="intro">let the music of your life help you find your forever dance partner</p>
                </p>
                <button className="button" onClick={this.signin}>sign in</button>
                <img id="eighthNote" src={eighthNote} />
                <img id="doubleEighthNote" src={doubleEighthNote} />
              </div>
              <div className="background">
                <svg id="ellipse5" height="510" width="510">
                  <circle r={510 / 2} />
                </svg>
                <svg id="ellipse1" height="651px" width="660px">
                  <ellipse rx={660 / 2} ry={651/2} />
                </svg>
                <svg id="ellipse2" height="853px" width="865px">
                  <ellipse rx={865 / 2} ry={853/2} />
                </svg>
              </div>
            </div>
    );
  }
}

class LoggedIn extends Component {
  componentDidMount() {
    var something = this.props.functions.httpsCallable("obtainSpotifyToken");
    something({authorization_code: this.props.code})
        //.then(res => {console.log(res)});
        .then(res=>{this.props.datafunc(res);
          console.log(res);
          window.location.assign('http://localhost:3000/index?code=' + res.data.access_token)});
  }

  render() {
    return (
      <div className="loading">
        <div id="loginMsg">logging you in</div>
        <img id="spinner" src={spinner} />
      </div>
    );
  }
}

export {LandingPage, LoggedIn};
