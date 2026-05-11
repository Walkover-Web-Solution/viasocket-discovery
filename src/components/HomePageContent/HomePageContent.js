import HomeTitle from "@/components/HomeTitle/HomeTitle";
import Search from "@/components/Search/Search";
import Chatbot from "@/components/ChatBot/ChatBot";
import SearchResults from "@/components/SearchResults/SearchResults";
import styles from "@/pages/home.module.scss";
import PopularContent from "@/components/PopularContent/PopularContent";
import BackToDashboardButton from "@/components/BackToDashboardButton/BackToDashboardButton";

const HomePageContent = ({
  blogCreating,
  isOpen,
  searchQuery,
  typingStart,
  blogs,
  searchCategories,
  isLoading,
  isCategoryClicked,
  setSearchQuery,
  setIsCategoryClicked,
  handleCreateBlog,
  handleAskAi,
  messages,
  setMessages,
  chatId,
  setTypingStart,
  setIsOpen,
  popularTags,
  popularUsers,
  tagsContainer,
  highlightText,
}) => {
  return (
    <>
      {!blogCreating && (
        <>
          {(isOpen || searchQuery || typingStart) && (
            <BackToDashboardButton
              className="btn"
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                zIndex: 10,
              }}
            />
          )}
          <div className={`p-4 search-click-result mb-5`}>
            {!isOpen && !searchQuery && !typingStart && <HomeTitle />}
            {typingStart && (
              <div className={styles.postHeaderDiv}>
                <SearchResults
                  blogs={blogs}
                  categories={searchCategories}
                  searchQuery={searchQuery}
                  isLoading={isLoading}
                  isCategoryClicked={isCategoryClicked}
                  onCategoryClick={(categoryName) => {
                    setSearchQuery(categoryName);
                    setIsCategoryClicked(true);
                  }}
                  onCreateBlog={handleCreateBlog}
                  tagsContainer={tagsContainer}
                  highlightText={highlightText}
                  fallback={searchQuery && !isOpen}
                />
              </div>
            )}
            <div className={typingStart ? "" : styles.centerWrapper}>
              <Search
                className={`w-75 px-3 ${typingStart ? "ps-5" : "centeredSearch"}`}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleAskAi={handleAskAi}
                placeholder={
                  isCategoryClicked || !typingStart
                    ? "Search"
                    : "Search or pick a category"
                }
                messages={messages}
                disableEnter
                setTypingStart={setTypingStart}
                setIsCategoryClicked={setIsCategoryClicked}
              />
              {!typingStart && (
                <PopularContent
                  popularTags={popularTags}
                  popularUsers={popularUsers}
                  setIsCategoryClicked={setIsCategoryClicked}
                />
              )}
            </div>
            <Chatbot
              bridgeId={process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE}
              messages={messages}
              setMessages={setMessages}
              chatId={chatId}
              homePage
              setIsOpen={setIsOpen}
              isOpen={isOpen}
              searchResults={
                searchQuery ? blogs.filter((blog) => !blog.dummy) : null
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default HomePageContent;
