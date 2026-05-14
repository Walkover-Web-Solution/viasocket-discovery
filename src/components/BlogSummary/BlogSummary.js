import React, { useEffect, useRef, useState } from "react";
import { appNameToId } from "@/utils/utils";
import styles from "./BlogSummary.module.scss";

const OBSERVER_OPTS = {
  rootMargin: "-30% 0px -55% 0px",
  threshold: [0, 0.5, 1],
};

const ACCENT_BG = "#a8200d";

const FALLBACK_ICON = "https://viasocket.com/assets/brand/favicon-96x96.png";

// Module-level cache so we never re-probe a URL we've already resolved
// (survives component unmount / list re-render). Values: "ok" | "fail".
const iconStatusCache = new Map();

// Same approach as MUI <Avatar>: pre-load the image in JS and only
// render the real src AFTER it successfully loads. If it errors, we
// keep the fallback. No broken/glitched image ever flashes on screen.
const SummaryIcon = React.memo(({ src, alt, domain }) => {
  const cached = src ? iconStatusCache.get(src) : "fail";
  const [resolvedSrc, setResolvedSrc] = useState(
    cached === "ok" ? src : FALLBACK_ICON
  );

  useEffect(() => {
    if (!src || src === FALLBACK_ICON) return;
    const status = iconStatusCache.get(src);
    if (status === "ok") return setResolvedSrc(src);
    if (status === "fail") return;

    const probe = new Image();
    const finish = (ok) => {
      iconStatusCache.set(src, ok ? "ok" : "fail");
      if (ok) setResolvedSrc(src);
      probe.onload = probe.onerror = null;
    };
    probe.onload = () => finish(probe.naturalWidth > 0);
    probe.onerror = () => finish(false);
    probe.src = src;

    return () => {
      probe.onload = probe.onerror = null;
    };
  }, [src]);

  return (
    <img
      src={resolvedSrc}
      width="24"
      height="24"
      alt={alt}
      data-domain={domain}
      className="blog-page__summary-icon me-2 rounded"
      loading="lazy"
    />
  );
});
SummaryIcon.displayName = "SummaryIcon";

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
              className={`${styles.summaryItem}${isActive ? " " + styles.active : ""} blog-page__summary-item d-flex align-items-center text-decoration-none p-2 text-dark border-bottom`}
            >
              <SummaryIcon src={iconUrl} alt={app} domain={domain} />
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
