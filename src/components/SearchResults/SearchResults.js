import Skeleton from "react-loading-skeleton";
import styles from "@/pages/home.module.scss";

const SearchResults = ({
  blogs,
  categories,
  searchQuery,
  isLoading,
  isCategoryClicked,
  onCategoryClick,
  onCreateBlog,
  tagsContainer,
  highlightText,
  fallback = false,
}) => {
  const renderBlogsSection = () => {
    return (
      <section>
        {tagsContainer()}
        {isLoading && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", placeItems: "center", gap: "16px" }} className="raginii">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="border-bottom p-3 w-100 text-center">
                <Skeleton
                  height={24}
                  width="80%"
                  count={1}
                  baseColor="#e0e0e0"
                  highlightColor="#f5f5f5"
                />
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", placeItems: "center", gap: "16px" }}>
          {blogs.length > 0
            ? blogs.map((blog) => (
                <a
                className="border-bottom p-3 w-100 text-center text-truncate"
                  rel="noopener noreferrer"
                  href={blog.dummy ? null : `/discovery/blog/${blog.id}`}
                  key={blog.id}
                  onClick={async () => {
                    if (blog.dummy) {
                      await onCreateBlog(blog.title);
                    }
                  }}
                >
                  <h6
                    className={
                      styles.titleSuggestion +
                      " " +
                      (blog.dummy ? styles.dummy : "")
                    }
                  >
                    {highlightText(blog.title, searchQuery)}
                  </h6>
                </a>
              ))
            : !isLoading &&
              fallback && (
                <h6 className={`${styles.titleSuggestion}`}>
                  No results here, hit enter or Ask AI !!!
                </h6>
              )}
        </div>
      </section>
    );
  };

  const renderCategoriesSection = () => {
    return (
      <section>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", placeItems: "center" }}>
          {categories.length > 0 &&
            categories.map((category) => (
              <a
                target={"_self"}
                className="border-bottom p-3 w-100 text-center"
                rel="noopener noreferrer"
                href={null}
                key={category.name}
                onClick={async () => {
                  onCategoryClick(category.name);
                }}
              >
                <h6 className={styles.titleSuggestion}>{category.name}</h6>
              </a>
            ))}
        </div>
      </section>
    );
  };

  if (isCategoryClicked) {
    return renderBlogsSection();
  }

  return renderCategoriesSection();
};

export default SearchResults;
