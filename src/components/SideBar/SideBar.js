import React, { Component } from "react";
import "./SideBar.css";
import HamburgerIcon from "../HamburgerIcon/HamburgerIcon";
import UserIcon from "../../assets/user1.png";
//import UserIcon from "../UserIcon";
import CompassIcon from "../../assets/explore1.png";
import RelationshipIcon from "../../assets/relationship1.png";

class SideBar extends Component {
  state = {
    collapsed: true,
  };

  //   let UserIcon = <Icon component={User} />

  onCollapse = () => {
    console.log("got here");

    this.setState({ collapsed: !this.collapsed });
  };

  render() {
    //const { collapsed } = this.state;
    let display = (
      <div className="SideBar">
        <HamburgerIcon onClick={this.onCollapse} />
        <div className="Separator" />
        <img
          id="RelationshipIcon"
          src={RelationshipIcon}
          alt="Relationship Matches"
          title="Matches"
        />
        <img id="CompassIcon" src={CompassIcon} alt="Compass" title="Explore" />
        {/* <button> */}
        <img id="UserIcon" src={UserIcon} alt="Profile" title="Profile" />
        {/* </button> */}
      </div>
    );
    if (!this.state.collapsed) {
      display = <div className="ExpandedSideBar"></div>;
    }
    return display;
  }
}

export default SideBar;
