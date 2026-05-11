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
    if (isLoading || disableEnter) return;
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
      <div
        className={`${styles.postHeader} ${className}`}
        onClick={() => {
          if (setTypingStart) setTypingStart(true);
        }}
      >
        <input
          type="text"
          className={`fs-6 ${styles.search}`}
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
