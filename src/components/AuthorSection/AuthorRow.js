import { FaLinkedinIn, FaFacebookF, FaTwitter } from "react-icons/fa";
import { formatDate } from "@/utils/utils";

function AuthorRow({ user, date }) {
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "?";
  return (
    <div className="d-flex align-items-center pb-5">
      <div className="d-flex align-items-center">
        <div className="d-flex gap-3 text-secondary me-3">
          <div
            className="border p-1 d-flex align-items-center justify-content-center"
            style={{ width: "26px", height: "26px" }}
          >
            <FaLinkedinIn />
          </div>
          <div
            className="border p-1 d-flex align-items-center justify-content-center"
            style={{ width: "26px", height: "26px" }}
          >
            <FaFacebookF />
          </div>
          <div
            className="border p-1 d-flex align-items-center justify-content-center"
            style={{ width: "26px", height: "26px" }}
          >
            <FaTwitter />
          </div>
        </div>
        <div
          className="border p-1 d-flex align-items-center justify-content-center me-2"
          style={{ width: "26px", height: "26px", fontSize: "12px" }}
        >
          {initials}
        </div>
        {user?.name && <span className="fw-semibold me-2">{user.name}</span>}
        {date && (
          <span className="text-secondary">{formatDate(new Date(date))}</span>
        )}
      </div>
    </div>
  );
}

export default AuthorRow;
