import React, { Component } from "react";
import "./LandingPage.css";
import { Button } from 'antd';
import 'antd/dist/antd.css';
// import firebase from 'firebase/app';
// import 'firebase/functions';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.signin = this.signin.bind(this);
  }

  signin() { // redirects the user to Spotify to authenticate
    var clientId = "579c4604e4ba46608b8f47b906ec23fc";
    var uri = "http%3A%2F%2F"+ "localhost%3A3000" + "%2Floggedin";
    window.location.assign('https://accounts.spotify.com/authorize'+'?client_id=' + clientId + "&"
     + 'response_type=code' + '&' 
     + 'redirect_uri=' + uri + '&' 
     // + 'state=' + state + '&'
     + 'scope=' + "user-top-read");
  }

  componentDidMount() {
    document.title = "prelude - the beginning of your next chapter";
  }

  render() {


    return (

          <div className="App">
            {//<img id="logo" alt="prelude logo" src={logo} />
            }
            <div id="logo">placeholder logo</div>
            <p id="left">
              <h1>prelude</h1>
              <p id="tagLine"><b>the beginning of your next chapter</b></p>
              <p id="intro">let the music help you find your forever dance partner</p>
            </p>
            <div id="buttons">
              <Button id="button" disabled>sign up</Button>
              <Button onClick={this.signin}>sign in</Button>
            </div>
          </div>

    );
  }
}

class LoggedIn extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("Component mounted?");
    var something = this.props.functions.httpsCallable("obtainSpotifyToken");
    console.log("Did something work?");
    something({authorization_code: this.props.code})
        .then(res => {console.log(res)});
  }
  
  render() {
    return (
      <LandingPage />
    );
  }
}

export {LandingPage, LoggedIn};
