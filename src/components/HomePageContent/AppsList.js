import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchApps } from "@/utils/apis/appsApis";
import styles from "./AppsList.module.scss";

const AppsList = ({ selectedCategory = "All", onSelectedAppsChange }) => {
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const [selectedApps, setSelectedApps] = useState([]);
  const INITIAL_APP_COUNT = 40;

  useEffect(() => {
    let cancelled = false;
    const loadApps = async () => {
      setAppsLoading(true);
      setShowAllApps(false);
      setSelectedApps([]);
      onSelectedAppsChange?.([]);
      const data = await fetchApps(selectedCategory, 1000, 0);
      if (!cancelled) {
        setApps(data);
        setAppsLoading(false);
      }
    };
    loadApps();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, onSelectedAppsChange]);

  if (appsLoading) {
    return <div className="text-center my-4">Loading apps...</div>;
  }

  const toggleApp = (appName) => {
    const isSelected = selectedApps.includes(appName);
    if (!isSelected && selectedApps.length >= 10) return;
    const next = isSelected
      ? selectedApps.filter((name) => name !== appName)
      : [...selectedApps, appName];
    setSelectedApps(next);
    onSelectedAppsChange?.(next);
  };

  return (
    <>
      <div className="row g-3 my-5 gap-1">
        {apps
          .slice(0, showAllApps ? apps.length : INITIAL_APP_COUNT)
          .map((app) => {
            const isSelected = selectedApps.includes(app.name);
            return (
              <div
                key={app.name}
                className="col-6 col-md-3 col-lg-2 text-center"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleApp(app.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleApp(app.name);
                    }
                  }}
                  className={`${styles.appCard} ${isSelected ? styles.selected : ""} text-dark d-flex align-items-center gap-2 border bg-white p-2`}
                >
                  {isSelected && <span className={styles.tick}>✓</span>}
                  <Image
                    src={
                      app.iconurl || `https://logo.clearbit.com/${app.domain}`
                    }
                    alt={app.name}
                    width={40}
                    height={40}
                    loading="lazy"
                    unoptimized
                    onError={() => {
                      // Next/Image unoptimized fallback handled by parent render if needed
                    }}
                  />
                  <div className="small fw-semibold text-truncate">
                    {app.name}
                  </div>
                </div>
              </div>
            );
          })}
        <div className="col-6 col-md-3 col-lg-2 text-center">
          <button
            type="button"
            className={`${styles.appCard} text-dark d-flex align-items-center gap-2 border-brand bg-white p-2 w-100`}
            style={{
              minHeight: "58px",
              border: "1px dashed",
            }}
          >
            <span
              className="fs-4 p-2 d-flex align-items-center justify-content-center border-brand"
              style={{
                width: "40px",
                height: "40px",
                border: "1px dashed",
                backgroundColor: "rgba(168, 32, 13, 0.05)",
              }}
            >
              +
            </span>
            <div className="small fw-semibold text-truncate">
              Request an app
            </div>
          </button>
        </div>
      </div>
      {apps.length > INITIAL_APP_COUNT && (
        <div className="text-center d-flex gap-4 align-items-center justify-content-center">
          <p className="text-muted">
            Showing {showAllApps ? apps.length : INITIAL_APP_COUNT} of{" "}
            {apps.length} apps
          </p>
          <button
            className="btn btn-sm btn-outline-dark"
            onClick={() => setShowAllApps((prev) => !prev)}
          >
            {showAllApps ? "Less" : "More"}
          </button>
        </div>
      )}
    </>
  );
};

export default AppsList;
