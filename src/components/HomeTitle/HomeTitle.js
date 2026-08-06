import React from "react";
import AccentBar from "../AccentBar/AccentBar";

const HomeTitle = () => {
  return (
    <div className="pt-4 home-page-header-title">
      {/* <p className="text-uppercase fw-semibold mb-0 d-inline-flex align-items-center gap-2 text-brand">
        <AccentBar />
        Automation Ideas
      </p> */}
      <h1 className="display-2 fw-normal mt-2 mb-0">
        The automation <em className="fst-italic text-brand">playbook</em> for{" "}
        <br />
        your company
      </h1>
      <p className="lead my-2">
        Pick up to three apps you use every day. Get a ready set of automations
        for <br /> them, each one launching in a single click.
      </p>
      <p className="fw-bold mt-5 d-flex align-items-center gap-2">
        Add up to 3 apps <span className="text-brand">0 of 3 added</span>
      </p>
    </div>
  );
};

export default HomeTitle;
