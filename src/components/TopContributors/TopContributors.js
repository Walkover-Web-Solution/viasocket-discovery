import React from 'react';

const TopContributors = ({ popularUsers }) => {
  if (!popularUsers || popularUsers.length === 0) return null;

  return (
    <section className="mt-5 px-3">
      <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-2 mb-3">
        <h2 className="m-0 fw-semibold" style={{ fontFamily: "var(--title-font)", fontSize: 36, lineHeight: 1.15 }}>
          Top <em className="fst-italic fw-medium" style={{ color: "#a8200d" }}>Contributors</em>
        </h2>
        <p className="m-0 fst-italic text-muted" style={{ fontSize: 15 }}>
          The editors and operators behind the picks
        </p>
      </div>
      <div className="row g-4">
        {popularUsers.map((user, index) => {
          const palette = ["#A8200D", "#0F4C81", "#2D6A4F", "#7B2D8E", "#C25E00", "#1F4D4D"];
          const avatarBg = palette[index % palette.length];
          const initials = user.name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w.charAt(0).toUpperCase())
            .join("");
          const displayName =
            user.name.split(" ")[0].charAt(0).toUpperCase() +
            user.name.slice(1);
          const bio = user?.meta?.bio
            ? user.meta.bio.split(" ").slice(0, 50).join(" ") +
            (user.meta.bio.split(" ").length > 50 ? "..." : "")
            : "Viasocket User";
          return (
            <div key={index} className="col-12 col-md-6">
              <a
                href={`/discovery/user/${user.id}`}
                className="d-flex flex-column justify-content-between position-relative border p-3 text-decoration-none text-dark bg-white h-100"
              >
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold flex-shrink-0"
                      style={{ width: 40, height: 40, background: avatarBg, fontSize: 14 }}
                    >
                      {initials}
                    </span>
                    <h3 className="m-0 fw-semibold" style={{ fontFamily: "var(--title-font)", fontSize: 20 }}>
                      {displayName}
                    </h3>
                  </div>
                  <p className="text-muted mb-2 fs-6 ps-3 pb-2">{bio}</p>
                </div>
                <div className="fs-6 ps-3 border-top pt-3 mt-auto">
                  {user.createdBlogs > 0 && (
                    <>
                      <strong>{user.createdBlogs}</strong>{" "}
                      blog{user.createdBlogs > 1 ? "s" : ""}
                    </>
                  )}
                  {user.contributedBlogs > 0 && user.createdBlogs > 0 && (
                    <span className="mx-2 opacity-50">·</span>
                  )}
                  {user.contributedBlogs > 0 && (
                    <>
                      <strong>{user.contributedBlogs}</strong>{" "}
                      contribution{user.contributedBlogs > 1 ? "s" : ""}
                    </>
                  )}
                </div>
                <span
                  className="position-absolute text-muted"
                  style={{ top: 12, right: 12 }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3h7v7M21 3l-9 9M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                  </svg>
                </span>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopContributors;
