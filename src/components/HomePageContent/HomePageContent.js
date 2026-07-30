import { useState, useEffect } from "react";
import HomeTitle from "@/components/HomeTitle/HomeTitle";
import Search from "@/components/Search/Search";
import Chatbot from "@/components/ChatBot/ChatBot";
import styles from "@/pages/home.module.scss";
import BackToDashboardButton from "@/components/BackToDashboardButton/BackToDashboardButton";
import AppsAndCategories from "./AppsAndCategories";
import RecentlyPublished from "./RecentlyPublished";
import TopContributors from "../TopContributors/TopContributors";
import { fetchApps } from "@/utils/apis/appsApis";

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

  useEffect(() => {
    const loadApps = async () => {
      const apps = await fetchApps();
      setAllApps(apps);
    };
    loadApps();
  }, []);

  const addAppByName = (appName) => {
    const app = allApps.find(app => app.name.toLowerCase() === appName.toLowerCase());
    if (app) {
      const isSelected = selectedApps.some(selectedApp => selectedApp.name === app.name);
      if (!isSelected && selectedApps.length < 4) {
        setSelectedApps(prev => [...prev, app]);
        return true;
      }
    }
    return false;
  };

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
          <div className={`p-4 search-click-result mb-5`}>
            {!isOpen && <HomeTitle />}
            <div className={styles.centerWrapper}>
              <Search
                className={`w-75 ragini centeredSearch`}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search apps or type app name and press Enter to add"
                selectedApps={selectedApps}
                onBuildUsecase={handleCreateUsecase}
                onClearApp={(app) => {
                  setSelectedApps((prev) => prev.filter((a) => a.name !== app.name));
                }}
                onClearAllApps={() => {
                  setSelectedApps([]);
                }}
                allApps={allApps}
                onAddApp={(app) => {
                  const isSelected = selectedApps.some(selectedApp => selectedApp.name === app.name);
                  if (!isSelected && selectedApps.length < 4) {
                    setSelectedApps(prev => [...prev, app]);
                  }
                }}
              />
              {!isOpen && (
                <AppsAndCategories
                  onSelectedAppsChange={setSelectedApps}
                  selectedApps={selectedApps}
                  searchQuery={searchQuery}
                />
              )}
            </div>

            <RecentlyPublished />
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
