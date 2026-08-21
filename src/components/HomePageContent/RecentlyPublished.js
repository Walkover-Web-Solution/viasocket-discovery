import React, { useEffect, useState } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { fetchRecentUsecases } from "@/utils/apis/usecaseApis";
import { nameToSlugName } from "@/utils/utils";
import styles from "./RecentlyPublished.module.scss";

const PAGE_SIZE = 10;
const FALLBACK_ICON = "https://viasocket.com/assets/brand/favicon-96x96.png";

// same canonical slug the usecase page builds — "<app slug>-automation-ideas"
function buildUsecaseLink(usecase) {
  const appSlug =
    usecase.app_slug || (usecase.app ? nameToSlugName(usecase.app) : "");
  if (!appSlug) return `/usecase/${usecase._id}`;
  return `/usecase/${appSlug.endsWith("-automation-ideas") ? appSlug : `${appSlug}-automation-ideas`}`;
}

function buildTitle(usecase) {
  const appName = usecase.app || usecase.apps?.[0]?.app;
  return appName
    ? `${appName} automation ideas`
    : usecase.h1 || "Automation ideas";
}

function formatPublishedDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const RecentlyPublished = () => {
  const [usecases, setUsecases] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetchRecentUsecases(1, PAGE_SIZE);
      if (!active) return;
      setUsecases(data?.usecases || []);
      setPagination(data?.pagination || null);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const loadMore = async () => {
    // pages already fetched before a "Less" only need revealing again
    if (visibleCount < usecases.length) {
      setVisibleCount((count) => count + PAGE_SIZE);
      return;
    }
    if (loadingMore || !pagination?.hasMore) return;
    setLoadingMore(true);
    const data = await fetchRecentUsecases(pagination.page + 1, PAGE_SIZE);
    // a usecase published while the visitor reads shifts the pages along, so
    // skip anything already on screen instead of showing it twice
    setUsecases((prev) => {
      const seen = new Set(prev.map((usecase) => usecase._id));
      return [
        ...prev,
        ...(data?.usecases || []).filter((usecase) => !seen.has(usecase._id)),
      ];
    });
    setPagination(data?.pagination || pagination);
    setVisibleCount((count) => count + PAGE_SIZE);
    setLoadingMore(false);
  };

  const showLess = () => setVisibleCount(PAGE_SIZE);

  if (loading) {
    return (
      <div className="py-5">
        <h2 className={`mb-4 fst-italic ${styles.heading}`}>
          Recently published
        </h2>
        <div className="row g-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 rounded-0">
                <div className="card-body d-flex flex-column align-items-start gap-3">
                  <Skeleton height={30} width={30} />
                  <div className={`w-100 ${styles.cardText}`}>
                    <Skeleton height={18} width="80%" className="mb-2" />
                    <Skeleton height={12} width="60%" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!usecases.length) return null;

  const visibleUsecases = usecases.slice(0, visibleCount);
  const canShowMore = visibleCount < usecases.length || !!pagination?.hasMore;
  const canShowLess = visibleCount > PAGE_SIZE;

  return (
    <div className="py-5">
      <h2 className={`mb-4 fst-italic ${styles.heading}`}>
        Recently published
      </h2>

      <div className="row g-4">
        {visibleUsecases.map((usecase) => {
          const publishedDate = formatPublishedDate(usecase.createdAt);

          return (
            <div key={usecase._id} className="col-12 col-sm-6 col-lg-4">
              <Link
                href={buildUsecaseLink(usecase)}
                className="text-decoration-none text-dark d-block h-100"
              >
                <div
                  className={`card h-100 rounded-0 ${styles.card}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body d-flex flex-column align-items-start gap-3">
                    <div className="d-flex gap-2 flex-wrap">
                      {(usecase.apps?.length
                        ? usecase.apps.slice(0, 3)
                        : [{}]
                      ).map((app, index) => (
                        <img
                          key={app.app_slug || app.app || index}
                          src={app.iconUrl || FALLBACK_ICON}
                          alt={app.app || buildTitle(usecase)}
                          className={`border rounded-3 p-1 ${styles.icon}`}
                        />
                      ))}
                    </div>

                    <div
                      className={`d-flex flex-column w-100 ${styles.cardText}`}
                    >
                      <h6 className={`mb-0 ${styles.cardTitle}`}>
                        {buildTitle(usecase)}
                      </h6>

                      {(usecase.author || publishedDate) && (
                        <small className="text-secondary">
                          {usecase.author}
                          {usecase.author && publishedDate ? " · " : ""}
                          {/* keep the date whole so a narrow card breaks the
                              line after the name, not inside "August 20, 2026" */}
                          {publishedDate && (
                            <span className="text-nowrap">{publishedDate}</span>
                          )}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {(canShowMore || canShowLess) && (
        <div className="d-flex flex-wrap align-items-center gap-2 mt-4">
          <p className="text-muted mb-0">
            Showing {visibleUsecases.length} of{" "}
            {pagination?.total ?? usecases.length} automation ideas
          </p>
          {canShowMore && (
            <a
              className="text-primary text-decoration-underline cursor-pointer"
              onClick={loadMore}
            >
              {loadingMore ? "Loading..." : "More"}
            </a>
          )}
          {canShowLess && (
            <a
              className="text-primary text-decoration-underline cursor-pointer"
              onClick={showLess}
            >
              Less
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentlyPublished;
