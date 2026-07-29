import React from "react";
import styles from "./RequestAppButton.module.scss";

const RequestAppButton = () => {
  return (
    <div className="col-6 col-md-3 col-lg-2 text-center">
      <button
        type="button"
        className={`${styles.requestAppButton} d-flex align-items-center gap-2 p-2 w-100`}
      >
        <span
          className={`${styles.plusIcon} fs-4 d-flex align-items-center justify-content-center`}
        >
          +
        </span>
        <div className="small fw-semibold text-truncate">Request an app</div>
      </button>
    </div>
  );
};

export default RequestAppButton;
