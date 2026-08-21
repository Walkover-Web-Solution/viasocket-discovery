import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { setPromptInUtmData } from "@/utils/handleUtmSource";

const UTM_SOURCE = "automation-ideas";

// keep this local: the button is the only place that tags its outgoing links
const withUtmSource = (url) => {
  if (!url) return url;
  if (/[?&]utm_source=/.test(url)) return url;
  const [base, hash] = url.split("#");
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}utm_source=${UTM_SOURCE}${hash ? `#${hash}` : ""}`;
};

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
      window.location.href = withUtmSource("/signup");
    }
  };

  if (href) {
    return (
      <Link
        className={className}
        style={{ width: "fit-content" }}
        href={withUtmSource(href)}
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
