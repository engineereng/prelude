import React, { Component } from "react";
import "./SideBar.css";
import HamburgerIcon from "../HamburgerIcon/HamburgerIcon";
import UserIcon from "../../assets/user1.png";
//import UserIcon from "../UserIcon";
import CompassIcon from "../../assets/explore1.png";
import RelationshipIcon from "../../assets/relationship1.png";
import X from "../../assets/Vector.png";

class SideBar extends Component {
  state = {
    collapsed: true,
  };

  //   let UserIcon = <Icon component={User} />

  onCollapse = () => {
    //let newState = !this.
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    //const { collapsed } = this.state;
    let display = (
      <div className="SideBar">
        <HamburgerIcon click={this.onCollapse} />
        <div className="Separator" />
        <img
          id="RelationshipIcon"
          src={RelationshipIcon}
          alt="Relationship Matches"
          title="Matches"
        />
        <img id="CompassIcon" src={CompassIcon} alt="Compass" title="Explore" />
        <img id="UserIcon" src={UserIcon} alt="Profile" title="Profile" />
      </div>
    );
    if (!this.state.collapsed) {
      display = (
        <div className="ExpandedSideBar">
          <div id="Logo">logo</div>
          <div className="Separator" style={{ width: "292px" }} />
          <button id="Matches">matches</button>
          <button id="Explore">explore</button>
          <button id="Profile">profile</button>
          <button id="SignOut">sign out</button>
          <div id="Ellipse" onClick={this.onCollapse} style={{cursor: "pointer"}}>
            <img id="Vector" src={X} />
          </div>
        </div>
      );
    }
    return display;
  }
}

export default SideBar;
