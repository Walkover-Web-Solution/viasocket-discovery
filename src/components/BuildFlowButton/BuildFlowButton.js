import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const BuildFlowButton = ({ onClick }) => {
  const className =
    "btn p-2 border border-brand d-flex align-items-center gap-2";
  const content = (
    <>
      Create Flow <FaArrowRight />
    </>
  );

  return (
    <Link
      className={className}
      style={{ width: "fit-content" }}
      href="https://viasocket.com/signup"
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </Link>
  );

  return (
    <button className={className} onClick={onClick}>
      {content}
    </button>
  );
};

export default BuildFlowButton;
