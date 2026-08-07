import React from "react";

const AccentBar = ({
  width = "8px",
  height = "8px",
  color = "#A8200D",
  className = "rounded-pill",
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
