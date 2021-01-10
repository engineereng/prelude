import React, { Component } from "react";
import SideBar from "../../components/SideBar/SideBar";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import "./MainPage.css";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picture_url: null,
      display_name: null
    }
  }

  componentDidMount() {
    var something = this.props.functions.httpsCallable("getProfile");
    something({access_token: this.props.data})
        .then(res => {
          this.setState({picture_url: res.data.images[0].url, display_name: res.data.display_name});
        });
  }

  render() {
    return (
      <div>
        <ProfileInfo picture_url = {this.state.picture_url} display_name = {this.state.display_name} />
        <SideBar />
      </div>
    );
  }
}

export default MainPage;
