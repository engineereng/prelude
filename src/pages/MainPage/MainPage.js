import React, { Component } from "react";
import SideBar from "../../components/SideBar/SideBar";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import "./MainPage.css";

class MainPage extends Component {
  render() {
    return (
      <div>
        <ProfileInfo />
        <SideBar />
      </div>
    );
  }
}

export default MainPage;
