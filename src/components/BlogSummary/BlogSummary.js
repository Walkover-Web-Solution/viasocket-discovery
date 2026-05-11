import React, { useEffect, useRef, useState } from "react";
import { appNameToId } from "@/utils/utils";
import styles from "./BlogSummary.module.scss";

const OBSERVER_OPTS = {
  rootMargin: "-30% 0px -55% 0px",
  threshold: [0, 0.5, 1],
};

const ACCENT_BG = "#a8200d";

// One shared error handler — reads the domain off the element
const handleImgError = (e) => {
  e.target.onerror = null;
  const domain = e.target.dataset.domain;
  if (domain) {
    e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }
};

// Hoisted once — never re-created
const ArrowIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const buildItem = (app, integrations) => {
  const id = appNameToId(app);
  const appData = integrations?.[app.toLowerCase()]?.plugins?.[id];
  const domain = appData?.domain || `${id}.com`;
  return {
    app,
    id,
    domain,
    iconUrl: appData?.iconurl || `https://logo.clearbit.com/${domain}`,
  };
};

const BlogSummary = ({ appNames, integrations, meta }) => {
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);

  useEffect(() => {
    if (!appNames?.length || typeof window === "undefined") return;

    const sections = appNames
      .map((app) => document.getElementById(appNameToId(app)))
      .filter(Boolean);
    if (!sections.length) return;

    const ratios = new Map();

    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) ratios.set(e.target.id, e.intersectionRatio);
        else ratios.delete(e.target.id);
      }

      let topId = null;
      let topRatio = -1;
      for (const [id, r] of ratios) {
        if (r > topRatio) {
          topRatio = r;
          topId = id;
        }
      }

      // Only commit if it actually changed
      if (topId && topId !== activeIdRef.current) {
        activeIdRef.current = topId;
        setActiveId(topId);
      }
    }, OBSERVER_OPTS);

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [appNames]);

  if (!appNames?.length) return null;

  return (
    <ul className="blog-page__summary-list list-unstyled d-flex flex-column border bg-white">
      {appNames.map((app) => {
        const { id, domain, iconUrl } = buildItem(app, integrations);
        const isActive = activeId === id;
        return (
          <li key={id} className="list-unstyled">
            <a
              href={`#${id}`}
              className={`${styles.summaryItem}${isActive ? " " + styles.active : ""} blog-page__summary-item d-flex align-items-center text-decoration-none p-3 text-dark border-bottom`}
            >
              <img
                src={iconUrl}
                width="32"
                height="32"
                alt={app}
                data-domain={domain}
                className="blog-page__summary-icon me-2 rounded"
                loading="lazy"
                onError={handleImgError}
              />
              <span className={`${styles.summaryLabel} fw-medium`}>{app}</span>
            </a>
          </li>
        );
      })}

      <li className="blog-page__view-all mt-auto" style={{ backgroundColor: ACCENT_BG }}>
        <a
          href={`https://viasocket.com/integrations/category/${meta?.categorySlug || "all"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center justify-content-between text-decoration-none text-white fw-bold p-3"
        >
          <span>View All from {meta?.category}</span>
          {ArrowIcon}
        </a>
      </li>
    </ul>
  );
};

export default React.memo(BlogSummary);
