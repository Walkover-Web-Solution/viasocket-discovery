import React from "react";

const BackToDashboardButton = ({
  className = "btn",
  label = "← Automation Ideas",
  onClick,
}) => {
  const defaultStyle = {
    display: "block",
    width: "100vw",
    position: "relative",
    // left: "50%",
    // right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
    background: "transparent",
    fontWeight: 500,
    padding: "20px 0",
    textAlign: "left",
    outline: "none",
    border: "none",
  };

  const handleClick = () => {
    if (onClick) onClick();
    // Hard navigation so home page (re)hydrates with fresh SSR props (popularUsers, categories, etc.)
    if (typeof window !== "undefined") {
      window.location.href = "/automation-ideas/";
    }
  };

  return (
    <button
      className={`${className} container mx-auto w-100 my-2`}
      onClick={handleClick}
      style={defaultStyle}
    >
      {label}
    </button>
  );
};

export default BackToDashboardButton;
