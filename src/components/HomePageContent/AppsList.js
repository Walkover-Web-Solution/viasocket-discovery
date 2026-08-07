import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchApps } from "@/utils/apis/appsApis";
import styles from "./AppsList.module.scss";

const AppsList = ({
  selectedCategory = "All",
  onSelectedAppsChange,
  selectedApps: parentSelectedApps = [],
  searchQuery = "",
}) => {
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  const [hasMoreApi, setHasMoreApi] = useState(true);
  const API_BATCH = 200;
  const MAX_APPS = 2200;

  useEffect(() => {
    let cancelled = false;
    const loadApps = async () => {
      setAppsLoading(true);
      setHasMoreApi(true);
      setDisplayCount(20);
      onSelectedAppsChange?.([]);
      const data = await fetchApps(selectedCategory, API_BATCH, 0);
      if (!cancelled) {
        setApps(data.slice(0, MAX_APPS));
        setAppsLoading(false);
        if (data.length < API_BATCH) {
          setHasMoreApi(false);
        }
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
    if (!isSelected && parentSelectedApps.length >= 3) return;
    const next = isSelected
      ? parentSelectedApps.filter((app) => app.name !== appName)
      : [...parentSelectedApps, apps.find((app) => app.name === appName)];
    onSelectedAppsChange?.(next);
  };

  const loadMore = async () => {
    const nextDisplay = displayCount + 200;
    setDisplayCount(nextDisplay);

    // If we need more apps than we have loaded, fetch from API
    if (nextDisplay > apps.length && hasMoreApi && apps.length < MAX_APPS) {
      setLoadingMore(true);
      const nextOffset = apps.length;
      const data = await fetchApps(selectedCategory, API_BATCH, nextOffset);
      setApps((prev) => {
        const combined = [...prev, ...data].slice(0, MAX_APPS);
        if (data.length < API_BATCH || combined.length >= MAX_APPS) {
          setHasMoreApi(false);
        }
        return combined;
      });
      setLoadingMore(false);
    }

    // If no more API data and we've shown all loaded apps, cap at loaded count
    if (!hasMoreApi && nextDisplay > apps.length) {
      setDisplayCount(apps.length);
    }
  };

  const filteredApps = searchQuery
    ? apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : apps;

  const visibleApps = filteredApps.slice(0, displayCount);
  const canShowMore = displayCount < filteredApps.length || hasMoreApi;

  return (
    <>
      <div className="row g-3 my-3 justify-content-center justify-content-md-start">
        {visibleApps.map((app) => {
          const isSelected = parentSelectedApps.some(
            (selectedApp) => selectedApp.name === app.name,
          );
          return (
            <div key={app.name} className="col-12 col-sm-6 col-md-4 col-lg-3">
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
                className={`${styles.appCard} ${isSelected ? styles.selected : ""} text-dark d-flex align-items-center gap-1 gap-sm-2 border bg-white p-2 w-100 h-100`}
              >

                <Image
                  src={
                    app.iconurl || `https://logo.clearbit.com/${app.domain}`
                  }
                  alt={app.name}
                  className="p-2"
                  width={40}
                  height={40}
                  loading="lazy"
                  unoptimized
                />
                <div className="small fw-semibold text-truncate">
                  {app.name}
                </div>
                <span className={`${styles.plusIcon} ${isSelected ? styles.selectedIcon : ""} ms-auto d-flex align-items-center justify-content-center rounded-pill`}>
                  {isSelected ? "✓" : "+"}
                </span>
              </div>
            </div>
          );
        })}
        {/* <RequestAppButton /> */}
        {canShowMore && (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="d-flex flex-wrap align-items-center gap-2 my-2">
              <p className="text-muted mb-0">
                Showing {visibleApps.length} of {MAX_APPS} apps
              </p>
              <a
                className="text-primary text-decoration-underline cursor-pointer"
                onClick={loadMore}
              >
                {loadingMore ? "Loading..." : "More"}
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AppsList;
