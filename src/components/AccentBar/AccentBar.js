import React from "react";

const AccentBar = ({
  width = "20px",
  height = "2px",
  color = "#A8200D",
  className = "",
  style = {},
}) => {
  return (
    <span
      className={className}
      style={{
        width,
        height,
        backgroundColor: color,
        display: "inline-block",
        ...style,
      }}
    />
  );
};

export default AccentBar;
