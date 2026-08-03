import React from "react";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const ContributeButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="btn btn-dark rounded-0 px-3 py-2 d-flex align-items-center gap-2"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        minWidth: "fit-content",
      }}
    >
      <ChatBubbleIcon /> Contribute
    </button>
  );
};

export default ContributeButton;
