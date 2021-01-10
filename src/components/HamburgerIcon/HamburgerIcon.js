import React from 'react';
import "./HamburgerIcon.css";

const hamburgerIcon = (props) => {
    const style = {
        backgroundColor: "Transparent",
        outline: "none",
        border: "none",
        cursor: "pointer"
    }
    return (
        <button style={style} onClick={props.click}>
            <div className="topBun" />
            <div className="patty" />
            <div className="bottomBun" />
        </button>
    )
}

export default hamburgerIcon;

