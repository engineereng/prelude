import React, { Component } from "react";
import SideBar from "../../components/SideBar/SideBar";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import "./MainPage.css";


class MainPage extends Component {
    
    render() {
        console.log("MAIN PAGE SEES: " + this.props.data);
        return (
            <div>
                
            <SideBar />
            <ProfileInfo />
            </div>
        );
    }
}

export default MainPage;