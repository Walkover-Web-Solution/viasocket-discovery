import React from "react";
import styles from "@/components/UnauthorisedPopup/UnauthorisedPopup.module.css"

const UnauthorizedPopup = ({ isOpen, onClose }) => {

  const handleLoginRedirect = () => {
    window.location.href = process.env.NEXT_PUBLIC_AUTH_REDIRECTION
  };

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
          <p>You need to log in to perform this action.</p>
          <button className={styles.authButton} onClick={handleLoginRedirect}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};


export default UnauthorizedPopup;
