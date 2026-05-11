import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import UserBioPopup from "@/components/UserBioPopup/UserBioPoup";

const UserProfileHeader = ({ user, currentUser, count }) => {
  const [userBioPopup, setUserBioPopup] = useState(false);

  return (
    <div className="pb-4 border-bottom mb-5">
      <div className="d-flex align-items-center gap-3 mb-3">
        <span
          className="d-flex align-items-center justify-content-center bg-light border border-dark"
          style={{ width: 44, height: 44 }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
            <path
              d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4"
              fill="currentColor"
            />
          </svg>
        </span>
        <h1
          className="h1 fw-bold m-0"
          style={{ fontFamily: "var(--title-font)" }}
        >
          {user.name}
        </h1>
        {user?.id === currentUser?.id && (
          <Tooltip title="Update Bio" arrow>
            <EditIcon
              className="text-secondary"
              onClick={() => setUserBioPopup(true)}
              style={{
                cursor: "pointer",
                marginLeft: "8px",
                alignSelf: "center",
              }}
            />
          </Tooltip>
        )}
      </div>
      <p className="lead mb-3 text-secondary fs-6">
        {user.id == currentUser?.id
          ? currentUser?.meta?.bio || ""
          : user?.meta?.bio || ""}
      </p>
      <p className="small text-muted fst-italic m-0">
        {count.createdCount > 0 && (
          <>
            {count.createdCount} blog{count.createdCount > 1 ? "s" : ""}
          </>
        )}
        {count.createdCount > 0 && count.contributed > 0 && (
          <span className="mx-1 opacity-50">·</span>
        )}
        {count.contributed > 0 && <>{count.contributed} contributed</>}
      </p>
      <UserBioPopup
        isOpen={userBioPopup}
        onClose={() => setUserBioPopup(false)}
        firstMessage={`Would you like to update your bio? Let us know what details you'd like to change or add, and we'll update it accordingly while keeping your existing information intact`}
      />
    </div>
  );
};

export default UserProfileHeader;
