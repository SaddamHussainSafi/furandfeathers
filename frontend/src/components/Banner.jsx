import React from "react";

const Banner = ({ title, image }) => (
  <div
    className="page-banner"
    style={{
      height: "500px",
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "2rem"
    }}
  >
    <h1>{title}</h1>
  </div>
);

export default Banner;
