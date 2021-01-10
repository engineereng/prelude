import React, { Component } from "react";
import "./LandingPage.css";
import logo from "../../assets/logo512.png";
import { Button } from 'antd';
import 'antd/dist/antd.css';

class LandingPage extends Component {
  

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
          <Button id="button">sign up</Button>
          <Button>sign in</Button>
        </div>
      </div>
    );
  }
}

export default LandingPage;
