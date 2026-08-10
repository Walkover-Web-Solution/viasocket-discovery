import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { setPromptInUtmData } from "@/utils/handleUtmSource";

const BuildFlowButton = ({ href, onClick, prompt }) => {
  const className =
    "btn p-2 border border-brand d-flex align-items-center gap-2 rounded-pill bg-white";
  const content = (
    <>
      Create Flow <FaArrowRight />
    </>
  );

  const handleClick = (e) => {
    setPromptInUtmData(prompt);
    if (onClick) {
      onClick(e);
    } else if (!href) {
      window.location.href = "/signup";
    }
  };

  if (href) {
    return (
      <Link
        className={className}
        style={{ width: "fit-content" }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button className={className} onClick={handleClick}>
      {content}
    </button>
  );
};

export default BuildFlowButton;
