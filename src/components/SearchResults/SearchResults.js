import Skeleton from "react-loading-skeleton";
import styles from "@/pages/home.module.scss";
import NoResultsSuggestions from "@/components/NoResultsSuggestions/NoResultsSuggestions";

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
          <div className="d-flex flex-column gap-3 px-5 w-100">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white border rounded p-3 w-100">
                <Skeleton
                  height={14}
                  width={`${60 + ((index * 13) % 30)}%`}
                  baseColor="#ece4dc"
                  highlightColor="#f7f1ea"
                />
                <Skeleton
                  height={10}
                  width={`${20 + ((index * 7) % 15)}%`}
                  baseColor="#ece4dc"
                  highlightColor="#f7f1ea"
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
                <NoResultsSuggestions />
              )}
        </div>
      </section>
    );
  };

  const renderCategoriesSection = () => {
    return (
      <section>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", placeItems: "center" }} className="my-5 pb-5">
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
