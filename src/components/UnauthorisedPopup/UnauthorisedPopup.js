import React, { useEffect } from "react";
import styles from "@/components/UnauthorisedPopup/UnauthorisedPopup.module.css"
import { handleSignIn } from "@/utils/utils";
import { useRouter } from "next/router";

const UnauthorizedPopup = ({ isOpen, onClose, searchQuery }) => {

  const router = useRouter();
  useEffect(()=>{
    if(router.isReady && searchQuery && isOpen) router.replace({ query: {...router.query , query : searchQuery} },undefined,{shallow : false})
  },[router.isReady, isOpen, searchQuery]);
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
          <button className={styles.authButton} onClick={handleSignIn}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};


export default UnauthorizedPopup;
