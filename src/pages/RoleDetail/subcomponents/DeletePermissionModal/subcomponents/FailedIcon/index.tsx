import React from "react";
import "./style.scss";
import { ReactComponent as FailedCreateKey } from "assets/images/svg/FailedCreateKey.svg";

const FailedIcon = () => {
  return (
    <div className="failedIcon-container">
      <div className="failedIcon-wrapper">
        <FailedCreateKey />
      </div>
    </div>
  );
};

export default FailedIcon;
