import React from 'react';
import "./HamburgerIcon.css";

const hamburgerIcon = () => {
    return (
        <button style={{backgroundColor: "white"}}>
            <div className="topBun" />
            <div className="patty" />
            <div className="bottomBun" />
        </button>
    )
}

export default hamburgerIcon;

