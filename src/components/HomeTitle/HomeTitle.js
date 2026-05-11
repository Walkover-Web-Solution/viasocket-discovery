import React from "react";
import AccentBar from "../AccentBar/AccentBar";

const HomeTitle = () => {
  return (
    <div className="px-3 pt-5 home-page-header-title w-75">
      <p
        className="text-uppercase fw-semibold mb-0 d-inline-flex align-items-center gap-2"
        style={{ color: "#a8200d" }}
      >
        <AccentBar />
        Discovery
      </p>
      <h1 className="display-1 fw-bold mt-2 mb-0">
        Discover{" "}
        <em className="fst-italic" style={{ color: "#a8200d" }}>
          Top
        </em>{" "}
        Software
      </h1>
      <p className="lead mb-0">
        {
          "Find top software from every category, thoughtfully curated by industry experts and individuals just like you."
        }
      </p>
      <p className="fst-italic text-muted my-4">
        Curated from{" "}
        <strong className="fst-normal fw-bold text-dark">10,000+</strong> apps
        <span className="mx-2 opacity-50">·</span>
        <strong className="fst-normal fw-bold text-dark">50+</strong>{" "}
        contributors
      </p>
    </div>
  );
};

export default HomeTitle;
