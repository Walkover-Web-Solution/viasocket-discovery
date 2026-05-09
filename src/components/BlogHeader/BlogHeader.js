import React from "react";
import { styled } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import { useRouter } from "next/router";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0)",
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
    padding: "20px",
  },
}));

const BlogHeader = ({ content, users, createdAt, subHeading, isUndereview, meta }) => {
  const router = useRouter();
  const routerPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentUrl = "https://viasocket.com/discovery" + routerPath;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(content)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const linkedInShare = `https://www.linkedin.com/feed/?shareActive=true&text=${content}! ${encodeURIComponent(currentUrl)} %23viasocket`;

  return (
    <>
      <button
        className="btn mt-4"
        onClick={() => router.push('/')}
      >
        ← Dashboard
      </button>
      <div className="container-fluid py-5 px-4 px-md-5 mx-auto my-5" style={{backgroundColor: "rgba(255, 255, 255, 0.35)", boxShadow: "0 4px 32px rgba(0, 0, 0, 0.06)"}}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ width: '20px', height: '2px', backgroundColor: '#A8200D' }}></span>
          <span className="text-danger text-uppercase fw-bold small tracking-wider" style={{ letterSpacing: '1.5px' }}>
            {meta?.category || 'TEAM COLLABORATION'}
          </span>
        </div>
      
      <h1 className="display-4 fw-medium my-3" style={{ fontFamily: 'var(--title-font)', lineHeight: '1.1' }}>
        {content}
      </h1>
      
      <p className="fs-5 text-secondary mb-4" style={{ fontFamily: 'var(--para-font)' }}>
        {subHeading}
      </p>
      
      <div className="d-flex gap-3 mb-4">
        <a href={linkedInShare} target="_blank" rel="noopener noreferrer" className="text-dark opacity-75 text-decoration-none">
          <LinkedInIcon fontSize="small" />
        </a>
        <a href={facebookShare} target="_blank" rel="noopener noreferrer" className="text-dark opacity-75 text-decoration-none">
          <FacebookIcon fontSize="small" />
        </a>
        <a href={twitterShare} target="_blank" rel="noopener noreferrer" className="text-dark opacity-75 text-decoration-none">
          <XIcon fontSize="small" />
        </a>
      </div>

      <div className="d-flex align-items-center gap-3 mt-4">
        <div className="border border-dark d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
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
            <HtmlTooltip title='This article is currently under review by our expert team.'>
              <h4 className="d-flex align-items-center gap-1 text-danger small fw-bold mb-0" style={{ cursor: 'pointer' }}>
                <TimelapseIcon fontSize="small" /> Under Review
              </h4>
            </HtmlTooltip>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default BlogHeader;
