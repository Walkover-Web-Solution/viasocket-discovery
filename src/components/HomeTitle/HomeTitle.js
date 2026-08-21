import React from "react";

const HomeTitle = () => {
  return (
    <div className="pt-4 home-page-header-title">
      {/* <p className="text-uppercase fw-semibold mb-0 d-inline-flex align-items-center gap-2 text-brand">
        <AccentBar />
        Automation Ideas
      </p> */}
      <h1 className="display-2 fw-normal mt-2 mb-0">
        Generate Automation <em className="fst-italic text-brand">Ideas</em>
      </h1>
      <p className="lead my-2">
        Pick your favorite apps to discover pre-built automation ideas, connect
        your tech stack, and streamline daily workflows with 1-click execution.
      </p>
      <p className="fw-bold mt-5 d-flex align-items-center gap-2">
        Add up to 3 apps <span className="text-brand">0 of 3 added</span>
      </p>
    </div>
  );
};

export default HomeTitle;
