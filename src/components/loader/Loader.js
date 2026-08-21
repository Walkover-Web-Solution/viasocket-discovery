import { useEffect, useLayoutEffect } from "react";
import BackToDashboardButton from "../BackToDashboardButton/BackToDashboardButton";
import { IoIosArrowRoundForward } from "react-icons/io";
import styles from "./loader.module.scss";

// Number of placeholder usecase blocks to show while the real ones stream in.
const PLACEHOLDER_SECTIONS = 8;

// The apps the visitor picked, read out as a phrase: "Slack",
// "Slack and Notion", "Slack, Notion and Trello".
function formatAppNames(apps) {
  const names = (apps || [])
    .map((app) => (typeof app === "string" ? app : app?.name))
    .filter(Boolean);
  if (!names.length) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

// Runs before the browser paints, so the loader is never shown at the previous
// scroll position first. Not available during SSR (the /loader preview page
// renders on the server), so fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const Loader = ({ apps = [] }) => {
  // The loader replaces the page content in place, so a page the user had
  // already scrolled down would open it half-way through the skeleton.
  //
  // globals.scss sets `html, body { height: 100%; overflow-x: hidden }`, which
  // makes <body> the scrolling element instead of the document — so
  // window.scrollTo() is a no-op here. Reset both, since which one scrolls
  // depends on that rule staying as it is.
  useIsomorphicLayoutEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  // a blog build shows the same loader without any apps, so both lines have to
  // read correctly with no names at all
  const appNames = formatAppNames(apps);

  return (
    <div className={`${styles.loader} container mx-auto w-md-75 w-100`}>
      <BackToDashboardButton />
      <div className="pb-5">
        <h3 className={styles.title}>
          Writing automation ideas{appNames ? ` for ${appNames}` : ""}
        </h3>
        <p
          className={`${styles.status} d-flex align-items-center text-secondary mb-3`}
        >
          {appNames
            ? `finding what ${appNames} users automate most`
            : "finding what users automate most"}
          <span className={`${styles.dots} d-inline-flex align-items-center`}>
            <span className="rounded-circle" />
            <span className="rounded-circle" />
            <span className="rounded-circle" />
          </span>
        </p>
        <div className={`${styles.progressTrack} rounded-pill overflow-hidden`}>
          <div className={`${styles.progressFill} h-100 rounded-pill`} />
        </div>

        {Array.from({ length: PLACEHOLDER_SECTIONS }).map((_, index) => (
          <div
            key={index}
            className={styles.section}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div
              className={`${styles.rows} d-flex flex-column align-items-start gap-3 w-100 my-4`}
            >
              <div
                className={`${styles.bar} ${styles.barTitle} w-25 rounded-2`}
              />
              <div
                className={`${styles.bar} ${styles.barLine} w-100 rounded-1`}
              />
              <div
                className={`${styles.bar} ${styles.barLineShort} w-50 rounded-1`}
              />
              <div className="d-flex gap-2 align-items-center">
                <span className={`${styles.bar} ${styles.pill} rounded-pill`} />
                <IoIosArrowRoundForward
                  className={`${styles.arrow} flex-shrink-0`}
                />
                <span className={`${styles.bar} ${styles.pill} rounded-pill`} />
                <IoIosArrowRoundForward
                  className={`${styles.arrow} flex-shrink-0`}
                />
                <span className={`${styles.bar} ${styles.pill} rounded-pill`} />
              </div>
              <div className={`${styles.bar} ${styles.barCta} rounded-2`} />
            </div>
            {index < PLACEHOLDER_SECTIONS - 1 && (
              <hr className={`${styles.divider} m-0 opacity-100`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
