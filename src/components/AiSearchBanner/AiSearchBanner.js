import React from "react";
import Search from "@/components/Search/Search";

const ACCENT = "#A8200D";

const StarDeco = ({ opacity, size }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    style={{ display: "block" }}
  >
    <path
      d="M50 0 C50 28,72 50,100 50 C72 50,50 72,50 100 C50 72,28 50,0 50 C28 50,50 28,50 0Z"
      fill={`rgba(255,220,210,${opacity})`}
    />
  </svg>
);

const AiSearchBanner = ({
  isOpen,
  searchQuery,
  setSearchQuery,
  handleAskAi,
}) => {
  return (
    <section
      className="position-relative d-flex align-items-center justify-content-center text-white overflow-hidden my-5 px-4 py-5 px-md-5"
      style={{ backgroundColor: ACCENT }}
    >
      <div
        className="position-absolute top-50 start-0 translate-middle-y ms-4 d-none d-md-block"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        <StarDeco opacity={0.55} size={140} />
      </div>
      <div
        className="position-absolute top-50 end-0 translate-middle-y me-4 d-none d-md-block"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        <StarDeco opacity={0.45} size={220} />
      </div>

      <div
        className="text-center position-relative p-4"
        style={{ maxWidth: 580, zIndex: 1 }}
      >
        <h2
          className="text-white fw-bold mb-3"
          style={{
            fontFamily: "var(--title-font)",
            fontSize: 36,
            lineHeight: 1.2,
          }}
        >
          Dive Deeper with AI
        </h2>
        <p
          className="text-white mb-4"
          style={{
            fontFamily: "var(--para-font)",
            fontSize: 15,
            lineHeight: 1.65,
          }}
        >
          Want to explore more? Follow up with AI for personalized insights and
          automated recommendations based on this blog
        </p>
        {!isOpen && (
          <Search
            className="centeredSearch"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleAskAi={handleAskAi}
            placeholder="Follow up if any query with AI..."
          />
        )}
      </div>
    </section>
  );
};

export default AiSearchBanner;
