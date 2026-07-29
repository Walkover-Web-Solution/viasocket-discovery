import React from "react";
import AccentBar from "../AccentBar/AccentBar";

const HomeTitle = () => {
  return (
    <div className="pt-5 home-page-header-title w-75">
      <p
        className="text-uppercase fw-semibold mb-0 d-inline-flex align-items-center gap-2 text-brand"
      >
        <AccentBar />
        Discovery
      </p>
      <h1 className="display-1 fw-bold mt-2 mb-0">
        The automation{" "}
        <em className="fst-italic text-brand">
          playbook
        </em>{" "}
        for your company
      </h1>
      <p className="lead mb-0">
        {
          "Pick up to three apps you use every day. Get a ready set of automations for them, each one launching in a single click."
        }
      </p>
      <p className="fst-italic text-muted my-4">
        Ideas for{" "}
        <strong className="fst-normal fw-bold text-dark">2,200+</strong> apps
        <span className="mx-2 opacity-50">·</span>
        built in one click
        <span className="mx-2 opacity-50">·</span>
        see an example
      </p>
    </div>
  );
};

export default HomeTitle;
