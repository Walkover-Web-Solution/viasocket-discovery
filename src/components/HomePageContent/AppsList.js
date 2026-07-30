import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchApps } from "@/utils/apis/appsApis";
import styles from "./AppsList.module.scss";
import RequestAppButton from "./RequestAppButton";

const AppsList = ({
  selectedCategory = "All",
  onSelectedAppsChange,
  selectedApps: parentSelectedApps = [],
  searchQuery = "",
}) => {
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const INITIAL_APP_COUNT = 40;

  useEffect(() => {
    let cancelled = false;
    const loadApps = async () => {
      setAppsLoading(true);
      setShowAllApps(false);
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
  }, [onSelectedAppsChange, selectedCategory]);

  if (appsLoading) {
    return <div className="text-center my-4">Loading apps...</div>;
  }

  const toggleApp = (appName) => {
    const isSelected = parentSelectedApps.some((app) => app.name === appName);
    if (!isSelected && parentSelectedApps.length >= 4) return;
    const next = isSelected
      ? parentSelectedApps.filter((app) => app.name !== appName)
      : [...parentSelectedApps, apps.find((app) => app.name === appName)];
    onSelectedAppsChange?.(next);
  };

  const filteredApps = searchQuery
    ? apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : apps;

  return (
    <>
      <div className="row g-2 my-5 gap-1">
        {filteredApps
          .slice(0, showAllApps ? filteredApps.length : INITIAL_APP_COUNT)
          .map((app) => {
            const isSelected = parentSelectedApps.some(
              (selectedApp) => selectedApp.name === app.name,
            );
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

                  />
                  <div className="small fw-semibold text-truncate">
                    {app.name}
                  </div>
                </div>
              </div>
            );
          })}
        <RequestAppButton />
        {filteredApps.length > INITIAL_APP_COUNT && (
          <div className="text-center d-flex gap-2 align-items-center w-75">
            <p className="text-muted">
              Showing {showAllApps ? filteredApps.length : INITIAL_APP_COUNT} of{" "}
              {filteredApps.length} apps
            </p>
            <a
              className="text-primary text-decoration-underline cursor-pointer"
              onClick={() => setShowAllApps((prev) => !prev)}
            >
              {showAllApps ? "Less" : "More"}
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default AppsList;
