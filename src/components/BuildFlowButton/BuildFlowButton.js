import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const BuildFlowButton = ({ href, onClick }) => {
  const className =
    "btn p-2 border border-brand d-flex align-items-center gap-2 rounded-pill bg-white";
  const content = (
    <>
      Create Flow <FaArrowRight />
    </>
  );

  if (href) {
    return (
      <Link
        className={className}
        style={{ width: "fit-content" }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick}>
      {content}
    </button>
  );
};

export default BuildFlowButton;
