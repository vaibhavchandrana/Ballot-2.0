import React from "react";
import "./../../css/NoDataComponent.css"; // Importing the CSS file for styling
import noDataImage from "./../../images/noDataFound.avif"; // Import your image here

const NoDataComponent = () => {
  return (
    <div className="no-data-container">
      <img src={noDataImage} alt="No Data Found" className="no-data-image" />
      <p className="no-data-text" style={{ color: "black" }}>
        No Data to Show
      </p>
    </div>
  );
};

export default NoDataComponent;
