import HomeTitle from "@/components/HomeTitle/HomeTitle";
import Search from "@/components/Search/Search";
import Chatbot from "@/components/ChatBot/ChatBot";
import SearchResults from "@/components/SearchResults/SearchResults";
import styles from "@/pages/home.module.scss";
import { useRouter } from "next/router";
import PopularContent from "@/components/PopularContent/PopularContent";

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
  const router = useRouter();
  return (
    <>
      {!blogCreating && (
        <>
          {(isOpen || searchQuery || typingStart) && (
            <button
              onClick={() => router.push("/")}
              className="border-0 bg-transparent my-4 d-flex align-items-center gap-2"
            >
              ← Dashboard
            </button>
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
