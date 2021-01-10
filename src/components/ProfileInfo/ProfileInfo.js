import React from "react";
import "./ProfileInfo.css";

const profileInfo = () => {
  return (
    <div id="ProfileInfoPanel">
      <div id="ProfilePhoto" />
      <div className="text">
        <div>
          <label id="name">name</label>
          <span>
            <input type="text" className="line" />
          </span>
        </div>
        <div>
          <div id="age">age</div>
          {/* <div className="line" /> */}
        </div>
        <div id="location">location</div>
        <div id="sexual-orientation">
          sexual <br />
          orientation
        </div>
      </div>
      <div style={{paddingLeft: '34px', paddingTop: "42px"}}>
        <button id="confirm" className="button-text">confirm</button>
   
        <button id="cancel" className="button-text">cancel</button>
      </div>
    </div>
  );
};

export default profileInfo;
