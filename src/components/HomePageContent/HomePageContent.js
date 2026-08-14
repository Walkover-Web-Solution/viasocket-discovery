import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import HomeTitle from "@/components/HomeTitle/HomeTitle";
import Search from "@/components/Search/Search";
import Chatbot from "@/components/ChatBot/ChatBot";
import styles from "@/pages/home.module.scss";
import BackToDashboardButton from "@/components/BackToDashboardButton/BackToDashboardButton";
import AppsAndCategories from "./AppsAndCategories";
import RecentlyPublished from "./RecentlyPublished";
import TopContributors from "../TopContributors/TopContributors";
import { fetchApps } from "@/utils/apis/appsApis";
import { useUser } from "@/context/UserContext";
import { getCurrentEnvironment, getFromCookies } from "@/utils/storageHelper";
import { nameToSlugName } from "@/utils/utils";

// an external panel deep-links into the build flow with ?web=true plus the app(s);
// accept whichever spelling the caller used for the app parameter
const APP_QUERY_KEYS = ["apps", "app", "appname", "app_slug", "appslug", "appslugname"];

// "Google Sheets", "google-sheets" and "googlesheets" all have to look the same
function normalizeAppKey(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function readAppsFromQuery(query) {
  const identifiers = [];
  Object.entries(query || {}).forEach(([key, value]) => {
    if (!APP_QUERY_KEYS.includes(key.toLowerCase())) return;
    (Array.isArray(value) ? value : [value]).forEach((entry) => {
      String(entry)
        .split(",")
        .forEach((part) => {
          const trimmed = part.trim();
          if (trimmed) identifiers.push(trimmed);
        });
    });
  });
  return identifiers;
}

// prefer the catalogue entry (real name + icon), but never drop a requested app:
// the catalogue only carries the first 200 apps, so fall back to the raw value
function resolveQueryApps(identifiers, allApps) {
  const seen = new Set();
  return identifiers.reduce((resolved, identifier) => {
    const key = normalizeAppKey(identifier);
    if (!key || seen.has(key)) return resolved;
    seen.add(key);

    const match = allApps.find(
      (app) =>
        normalizeAppKey(app.appslugname) === key ||
        normalizeAppKey(app.name) === key,
    );
    resolved.push(
      match || { name: identifier, appslugname: nameToSlugName(identifier) },
    );
    return resolved;
  }, []);
}

const HomePageContent = ({
  blogCreating,
  usecaseCreating,
  isOpen,
  searchQuery,
  setSearchQuery,
  handleCreateUsecase,
  messages,
  setMessages,
  chatId,
  setIsOpen,
  popularUsers,
}) => {
  const [selectedApps, setSelectedApps] = useState([]);
  const [allApps, setAllApps] = useState([]);
  const [appsLoaded, setAppsLoaded] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const autoBuiltRef = useRef(false);

  useEffect(() => {
    const loadApps = async () => {
      const apps = await fetchApps();
      setAllApps(apps);
      setAppsLoaded(true);
    };
    loadApps();
  }, []);

  // deep link from an external panel: select the requested apps and start the
  // same build the Enter key would, so the loader takes over immediately
  useEffect(() => {
    // wait for the catalogue so apps resolve to their real names, but only for
    // the request to settle — an empty catalogue must not block the deep link
    if (autoBuiltRef.current || !router.isReady || !appsLoaded) return;

    if (String(router.query.web).toLowerCase() !== "true") return;

    const identifiers = readAppsFromQuery(router.query);
    if (!identifiers.length) return;

    // a signed-in visitor would get the unauthorized popup if we fired while
    // their session was still being fetched, so wait for it to resolve first
    if (!user && getFromCookies(getCurrentEnvironment())) return;

    const queryApps = resolveQueryApps(identifiers, allApps);
    if (!queryApps.length) return;

    autoBuiltRef.current = true;
    setSelectedApps(queryApps);
    handleCreateUsecase?.(queryApps, "");
  }, [router.isReady, router.query, appsLoaded, allApps, user, handleCreateUsecase]);

  return (
    <>
      {!blogCreating && !usecaseCreating && (
        <>
          {isOpen && (
            <BackToDashboardButton
              onClick={() => {
                setSearchQuery("");
                setIsOpen(false);
              }}
            />
          )}
          <div className={`p-4 search-click-result mb-5 w-100 w-md-75 mx-auto`}>
            {!isOpen && <HomeTitle />}
            <div className={styles.centerWrapper}>
              <Search
                className={`ragini centeredSearch`}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search 2,200+ apps…"
                selectedApps={selectedApps}
                onBuildUsecase={handleCreateUsecase}
                onClearApp={(app) => {
                  setSelectedApps((prev) =>
                    prev.filter((a) => a.name !== app.name),
                  );
                }}
                onClearAllApps={() => {
                  setSelectedApps([]);
                }}
                allApps={allApps}
                onAddApp={(app) => {
                  const isSelected = selectedApps.some(
                    (selectedApp) => selectedApp.name === app.name,
                  );
                  if (!isSelected && selectedApps.length < 4) {
                    setSelectedApps((prev) => [...prev, app]);
                  }
                }}
              />
              {!isOpen && (
                <AppsAndCategories
                  onSelectedAppsChange={setSelectedApps}
                  selectedApps={selectedApps}
                  searchQuery={searchQuery}
                  onBuildUsecase={handleCreateUsecase}
                />
              )}
            </div>
            <div className="">
              <RecentlyPublished />
            </div>

            <TopContributors popularUsers={popularUsers} />
            <Chatbot
              bridgeId={process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE}
              messages={messages}
              setMessages={setMessages}
              chatId={chatId}
              homePage
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
          </div>
        </>
      )}
    </>
  );
};

export default HomePageContent;
