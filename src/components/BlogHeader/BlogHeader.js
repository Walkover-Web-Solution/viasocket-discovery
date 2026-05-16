import React from "react";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import AccentBar from "../AccentBar/AccentBar";
import HtmlTooltip from "../HtmlTooltip/HtmlTooltip";

const BlogHeader = ({
  content,
  users,
  createdAt,
  subHeading,
  isUndereview,
  meta,
}) => {
  const routerPath =
    typeof window !== "undefined" ? window.location.pathname : "";
  const currentUrl = "https://viasocket.com/discovery" + routerPath;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(content)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const linkedInShare = `https://www.linkedin.com/feed/?shareActive=true&text=${content}! ${encodeURIComponent(currentUrl)} %23viasocket`;

  return (
    <section className="position-relative">
      <div
        className="container-fluid py-5 px-4 px-md-5 mx-auto mb-5"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.35)",
          boxShadow: "0 4px 32px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-2">
          <AccentBar />
          <span
            className="text-uppercase fw-bold small tracking-wider"
            style={{ letterSpacing: "1.5px", color: "#A8200D" }}
          >
            {meta?.category || "TEAM COLLABORATION"}
          </span>
        </div>

        <h1 className="display-4 fw-medium my-3" style={{ lineHeight: "1.1" }}>
          {content}
        </h1>

        <p className="fs-5 text-secondary mb-4">{subHeading}</p>

        <div className="d-flex gap-3 mb-4">
          <a
            href={linkedInShare}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark opacity-75 text-decoration-none"
          >
            <LinkedInIcon fontSize="small" />
          </a>
          <a
            href={facebookShare}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark opacity-75 text-decoration-none"
          >
            <FacebookIcon fontSize="small" />
          </a>
          <a
            href={twitterShare}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark opacity-75 text-decoration-none"
          >
            <XIcon fontSize="small" />
          </a>
        </div>

        <div className="d-flex align-items-center gap-3 mt-4">
          <div
            className="border border-dark d-flex align-items-center justify-content-center fw-bold"
            style={{ width: "40px", height: "40px", fontSize: "0.9rem" }}
          >
            {users?.[0]?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="d-flex align-items-center gap-4">
            <span className="fw-bold small">{users?.[0]?.name}</span>
            <span className="text-muted small">
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
          {isUndereview != false && (
            <div className="ms-auto">
              <HtmlTooltip
                placement="left"
                title={
                  <>
                    <div
                      className="d-flex align-items-center gap-2 mb-1 text-uppercase fw-bold"
                      style={{
                        // color: ACCENT,
                        letterSpacing: "1px",
                        fontSize: "10px",
                      }}
                    >
                      <TimelapseIcon style={{ fontSize: 14 }} />
                      Under Review
                    </div>
                    <span style={{ fontSize: "10px" }}>
                      This article is currently being reviewed by our expert
                      team to ensure accuracy and quality before publication.
                    </span>
                  </>
                }
              >
                <h4
                  className="d-flex align-items-center gap-1 small fw-bold mb-0"
                  style={{ cursor: "pointer", color: "#A8200D" }}
                >
                  <TimelapseIcon /> Under Review
                </h4>
              </HtmlTooltip>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogHeader;
