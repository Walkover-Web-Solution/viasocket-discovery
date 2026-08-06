import React, { useRef, useState, useEffect } from "react";
import styles from "./Search.module.scss";
import { useUser } from "@/context/UserContext";
import { IconButton } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";
import UnauthorizedPopup from "../UnauthorisedPopup/UnauthorisedPopup";

export default function Search({
  searchQuery,
  setSearchQuery,
  placeholder,
  className,
  selectedApps = [],
  onBuildUsecase,
  onClearApp,
  onClearAllApps,
  allApps = [],
  onAddApp,
}) {
  const { user } = useUser();
  const [unAuthPopup, setUnAuthPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const handleClick = () => {
    if (isLoading) return;
    if (selectedApps.length > 0) {
      onBuildUsecase?.(selectedApps, searchQuery);
      return;
    }
    // Try to add app by name if search query exists
    if (searchQuery.trim() && allApps.length > 0) {
      const app = allApps.find(
        (app) => app.name.toLowerCase() === searchQuery.trim().toLowerCase(),
      );
      if (app) {
        const isSelected = selectedApps.some(
          (selectedApp) => selectedApp.name === app.name,
        );
        if (!isSelected && selectedApps.length < 4) {
          onAddApp?.(app);
          setSearchQuery("");
        }
      }
    }
  };

  const handleClearApp = (app) => {
    onClearApp?.(app);
  };

  const handleClearAllApps = () => {
    onClearAllApps?.();
  };

  const onUnAuthClose = () => {
    setUnAuthPopup(false);
  };

  return (
    <>
      <div className={`${styles.postHeader} ${className}`}>
        <div className={`${styles.searchBox} rounded-pill border`}>
          {selectedApps.length > 0 && (
            <div className="d-flex flex-wrap gap-2 me-2 align-items-center">
              {selectedApps.map((app) => (
                <span
                  key={app.name}
                  className={`badge rounded d-flex align-items-center gap-1 border border-brand bg-brand-subtle text-brand fs-12 ${styles.appBadge}`}
                >
                  {app.name}
                  <IconButton
                    size="small"
                    className="p-0 ms-1"
                    onClick={() => handleClearApp(app)}
                    style={{ minWidth: "auto", padding: "2px" }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </span>
              ))}
              <IconButton
                size="small"
                className="p-0 ms-1"
                onClick={handleClearAllApps}
                style={{ minWidth: "auto", padding: "2px" }}
              >
                <CloseIcon sx={{ fontSize: 16, color: "inherit" }} />
              </IconButton>
            </div>
          )}
          <input
            type="text"
            className={`fs-6 ${styles.searchInput}`}
            placeholder={
              selectedApps.length > 0 ? "" : placeholder || "Ask AI..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClick();
              }
              if (
                e.key === "Backspace" &&
                searchQuery === "" &&
                selectedApps.length > 0
              ) {
                // Remove the last selected app
                const lastApp = selectedApps[selectedApps.length - 1];
                handleClearApp(lastApp);
              }
            }}
            ref={inputRef}
          />
        </div>
        <IconButton
          onClick={handleClick}
          edge="end"
          size="small"
          className={`${styles.askAi} ${selectedApps.length > 0 ? styles.askAiActive : ""}`}
        >
          {selectedApps.length > 0 ? (
            <ArrowUpwardIcon fontSize="small" />
          ) : (
            <AutoAwesomeOutlinedIcon fontSize="small" />
          )}
        </IconButton>
      </div>
      <UnauthorizedPopup isOpen={unAuthPopup} onClose={onUnAuthClose} />
    </>
  );
}
