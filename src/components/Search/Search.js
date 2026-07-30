import React, { useRef, useState, useEffect } from "react";
import styles from "./Search.module.scss";
import { useUser } from "@/context/UserContext";
import { IconButton } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import UserBioPopup from "../UserBioPopup/UserBioPoup";
import UnauthorizedPopup from "../UnauthorisedPopup/UnauthorisedPopup";
import { dispatchAskAppAiWithAuth } from "@/utils/utils";

export default function Search({
  searchQuery,
  setSearchQuery,
  handleAskAi,
  placeholder,
  className,
  messages,
  disableEnter,
  setTypingStart,
  setIsCategoryClicked,
  selectedApps = [],
  onBuildUsecase,
}) {
  const { user } = useUser();
  const [unAuthPopup, setUnAuthPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userBioPopup, setUserBioPopup] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user?.meta?.bio && userBioPopup) {
      setUserBioPopup(false);
    }
  }, [user]);
  useEffect(() => {
    if (messages && messages[messages.length - 1]?.role === "user") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [messages]);
  const handleClick = () => {
    if (isLoading) return;
    if (selectedApps.length > 0) {
      onBuildUsecase?.(selectedApps, searchQuery);
      return;
    }
    if (disableEnter) return;
    dispatchAskAppAiWithAuth(searchQuery, () => {
      setSearchQuery("");
      handleAskAi();
    });
  };

  const onUnAuthClose = () => {
    setUnAuthPopup(false);
  };

  useEffect(() => {
    if (user?.meta?.bio && userBioPopup) {
      setUserBioPopup(false);
    }
  }, [user]);

  return (
    <>
      <div className={`${styles.postHeader} ${className}`}>
        <div className={styles.searchBox}>
          {selectedApps.length > 0 && (
            <div className="d-flex flex-wrap gap-2 me-2">
              {selectedApps.map((app) => (
                <span
                  key={app.name}
                  className="badge rounded d-flex align-items-center gap-1 border border-brand bg-brand-subtle text-brand fs-12"
                >
                  {app.name}
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            className={`fs-6 ${styles.searchInput}`}
            placeholder={placeholder || "Ask AI..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsCategoryClicked(true);
                handleClick();
              }
            }}
            ref={inputRef}
          />
        </div>
        <IconButton
          onClick={handleClick}
          edge="end"
          size="large"
          className={styles.askAi}
        >
          <AutoAwesomeOutlinedIcon fontSize="large" sx={{ color: "black" }} />
        </IconButton>
      </div>
      <UnauthorizedPopup isOpen={unAuthPopup} onClose={onUnAuthClose} />
      <UserBioPopup
        isOpen={userBioPopup}
        onClose={() => setUserBioPopup(false)}
      />
    </>
  );
}
