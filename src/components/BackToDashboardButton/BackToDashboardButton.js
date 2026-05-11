import React from "react";

const BackToDashboardButton = ({ className = "btn px-xl-5", label = "← Discovery", style, onClick }) => {
  const defaultStyle = {
    display: "block",
    width: "100vw",
    position: "relative",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
    background: "transparent",
    fontWeight: 500,
    padding: "20px",
    textAlign: "left",
    outline: "none",
    border: "none",
  };

  const handleClick = () => {
    if (onClick) onClick();
    // Hard navigation so home page (re)hydrates with fresh SSR props (popularUsers, categories, etc.)
    if (typeof window !== "undefined") {
      window.location.href = "/discovery/";
    }
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      style={{ ...defaultStyle, ...(style || {}) }}
    >
      {label}
    </button>
  );
};

export default BackToDashboardButton;
