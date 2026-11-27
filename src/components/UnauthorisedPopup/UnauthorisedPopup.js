import React, { useEffect, useState } from "react";
import styles from "@/components/UnauthorisedPopup/UnauthorisedPopup.module.css"
import { getDiscoveryAuthEntry } from "@/utils/authRedirect";
import { getProxyAuthToken } from "@/utils/storageHelper";
import { handleSignIn } from "@/utils/utils";

const UnauthorizedPopup = ({ isOpen, onClose }) => {
  const [hasProxyToken, setHasProxyToken] = useState(false);
  const [panelHref, setPanelHref] = useState("https://flow.viasocket.com");

  useEffect(() => {
    if (!isOpen) return;
    setHasProxyToken(Boolean(getProxyAuthToken()));
    const entry = getDiscoveryAuthEntry({
      utmSource: window.location.pathname + window.location.search,
    });
    setPanelHref(entry.href);
  }, [isOpen]);

  if (!isOpen) {
    return (null);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>
            &#10005;
          </button>
        </div>
        <div className={styles.body}>
          <p>
            {hasProxyToken
              ? "You are already signed in."
              : "You need to log in to perform this action."}
          </p>
          {hasProxyToken ? (
            <a className={styles.authButton} href={panelHref}>
              Go to panel
            </a>
          ) : (
            <button className={styles.authButton} onClick={handleSignIn}>
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default UnauthorizedPopup;
