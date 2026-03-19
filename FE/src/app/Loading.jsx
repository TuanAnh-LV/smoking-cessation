import React from "react";
import "./Loading.css";

const Loading = ({ fullScreen = true }) => {
  return (
    <div className={`loading-container ${fullScreen ? "is-fullscreen" : ""}`}>
      <div className="loading-spinner" role="status" aria-label="Loading">
        <span className="loading-spinner__ring"></span>
        <span className="loading-spinner__ring loading-spinner__ring--inner"></span>
      </div>
    </div>
  );
};

export default Loading;
