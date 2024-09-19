import { useEffect, useRef } from 'react';
import styles from "@/components/PopupModel/Popup.module.css"; 

const Popup = ({ isOpen, onClose, handlePublish }) => {
  const popupRef = useRef(null); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose(); 
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.popup_overlay}>
      <div className={styles.popup} ref={popupRef}>
        <button className={styles.popup_close} onClick={onClose}>
          &times;
        </button>
        <div className={styles.popup_content}>The content will be published as a new blog</div>
        <div className={styles.popup_actions}>
          <button className={styles.cancel_button} onClick={onClose}>Cancel</button>
          <button className={styles.publish_button} onClick={handlePublish}>Publish</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
