import React from "react";
import styles from "./RequestAppButton.module.scss";
import RequestIntegrationModal from "../RequestIntegrationModal/RequestIntegrationModal";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

const RequestAppButton = () => {
  return (
    <>
      <div className="col-12">
        <button
          type="button"
          className={`${styles.requestAppButton} d-flex align-items-center gap-1 gap-sm-2 p-2 w-100 h-100`}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <span
            className={`${styles.plusIcon} fs-4 d-flex align-items-center justify-content-center`}
          >
           <AutoAwesomeOutlinedIcon />
          </span>
          <div className="small text-truncate">
            One more app and your automation ideas appear here.
          </div>
        </button>
      </div>
      <RequestIntegrationModal type="app" />
    </>
  );
};

export default RequestAppButton;
