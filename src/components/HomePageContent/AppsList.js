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
  onAppsLoaded,
}) => {
  const [allApps, setAllApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(40);
  const MAX_APPS = 2200;

  useEffect(() => {
    let cancelled = false;
    const loadAllApps = async () => {
      setAppsLoading(true);
      setDisplayCount(40);
      onSelectedAppsChange?.([]);
      
      const category = selectedCategory === "All" ? "" : selectedCategory;
      let allData = [];
      let offset = 0;
      let hasMore = true;
      
      while (hasMore && !cancelled && allData.length < MAX_APPS) {
        const data = await fetchApps(category, 200, offset);
        if (data.length > 0) {
          allData = [...allData, ...data];
          offset += 200;
          hasMore = data.length === 200;
        } else {
          hasMore = false;
        }
      }
      
      if (!cancelled) {
        setAllApps(allData);
        setAppsLoading(false);
        onAppsLoaded?.(allData);
      }
    };
    loadAllApps();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  const loadMoreApps = () => {
    setDisplayCount((prev) => prev + 40);
  };

  if (appsLoading) {
    return <div className="text-center my-4">Loading apps...</div>;
  }

  const toggleApp = (appName) => {
    const isSelected = parentSelectedApps.some((app) => app.name === appName);
    if (!isSelected && parentSelectedApps.length >= 4) return;
    const next = isSelected
      ? parentSelectedApps.filter((app) => app.name !== appName)
      : [...parentSelectedApps, allApps.find((app) => app.name === appName)];
    onSelectedAppsChange?.(next);
  };

  const filteredApps = searchQuery
    ? allApps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allApps;

  const displayedApps = searchQuery ? filteredApps : filteredApps.slice(0, displayCount);
  const showMoreButton = !searchQuery && displayCount < filteredApps.length;

  return (
    <>
      <div className="row g-2 my-5 gap-1">
        {displayedApps.map((app) => {
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
        {showMoreButton && (
          <div className="text-center d-flex gap-2 align-items-center w-75">
            <p className="text-muted">
              Showing {displayedApps.length} of {filteredApps.length} apps
            </p>
            <a
              className="text-primary text-decoration-underline cursor-pointer"
              onClick={loadMoreApps}
            >
              More
            </a>
          </div>
        )}
        {!showMoreButton && !searchQuery && filteredApps.length > 0 && (
          <div className="text-center d-flex gap-2 align-items-center w-75">
            <p className="text-muted">
              Showing all {filteredApps.length} apps
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AppsList;
