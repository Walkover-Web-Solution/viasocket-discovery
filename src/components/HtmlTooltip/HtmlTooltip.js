import React from "react";
import { styled } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip arrow {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
    fontSize: theme.typography.pxToRem(13),
    lineHeight: 1.5,
    maxWidth: 320,
    padding: "14px 16px",
    borderRadius: 0,
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
    fontFamily: "var(--font-body)",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#ffffff",
    "&::before": {
      boxSizing: "border-box",
    },
  },
}));

export default HtmlTooltip;
