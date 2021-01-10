import React from "react";
import "./ProfileInfo.css";

const profileInfo = () => {
  return (
    <div id="ProfileInfoPanel">
      <div id="ProfilePhoto" />
      <div className="text">
        <div style={{ marginTop: "68px" }}>
          <label id="name">name</label>

          <input type="text" className="line" id="name-line" />
        </div>
        <div style={{ marginTop: "24px" }}>
          <label id="age">age</label>
          <input type="text" className="line" id="age-line" />
        </div>
        <div style={{ marginTop: "26px" }}>
          <label id="location">location</label>
          <input type="text" className="line" id="location-line" />
        </div>
        <label id="sexual-orientation">
          sexual<br/>
          orientation
        </label>
        <input type="text" className="line" id="sexual-orientation-line" />
      </div>
      <div style={{ paddingLeft: "34px", paddingTop: "20px" }}>
        <button id="confirm" className="button-text">
          confirm
        </button>

        <button id="cancel" className="button-text">
          cancel
        </button>
      </div>
    </div>
  );
};

export default profileInfo;
