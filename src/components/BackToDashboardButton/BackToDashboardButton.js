import React from "react";
import { useRouter } from "next/router";

const BackToDashboardButton = ({ className = "btn mt-4 mb-3", label = "← Discovery", style }) => {
  const router = useRouter();

  const defaultStyle = {
    border: "none",
    background: "transparent",
    fontWeight: 500,
    padding: 0,
  };

  return (
    <button
      className={className}
      onClick={() => router.push('/')}
      style={{ ...defaultStyle, ...(style || {}) }}
    >
      {label}
    </button>
  );
};

export default BackToDashboardButton;
