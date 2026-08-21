import { useState, useEffect } from "react";
import AppsList from "./AppsList";
import { fetchCategories } from "@/utils/apis/appsApis";

// the tags API returns its own order — lead with this category wherever it lands
const PINNED_CATEGORY = "Top Free Apps";

function pinCategoryFirst(categories) {
  const list = Array.isArray(categories) ? categories : [];
  const index = list.findIndex(
    (category) =>
      category?.name?.toLowerCase() === PINNED_CATEGORY.toLowerCase(),
  );
  if (index <= 0) return list;
  return [list[index], ...list.slice(0, index), ...list.slice(index + 1)];
}

const AppsAndCategories = ({
  onSelectedAppsChange,
  selectedApps,
  searchQuery,
  onBuildUsecase,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const INITIAL_CATEGORY_COUNT = 6;

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(pinCategoryFirst(data));
    };
    loadCategories();
  }, []);

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 my-4">
        <button
          className={`btn btn-sm rounded-pill ${selectedCategory === "All" ? "btn-dark" : "btn-outline-secondary"}`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>
        {categories
          .slice(
            0,
            showAllCategories ? categories.length : INITIAL_CATEGORY_COUNT,
          )
          .map((category) => (
            <button
              key={category.name}
              className={`btn btn-sm rounded-pill ${selectedCategory === category.name ? "btn-dark" : "btn-outline-secondary"}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        {categories.length > INITIAL_CATEGORY_COUNT && (
          <a
            className="text-primary ms-2 text-decoration-underline cursor-pointer"
            onClick={() => setShowAllCategories((prev) => !prev)}
          >
            {showAllCategories ? "Less" : "More"}
          </a>
        )}
      </div>
      <AppsList
        selectedCategory={selectedCategory}
        onSelectedAppsChange={onSelectedAppsChange}
        selectedApps={selectedApps}
        searchQuery={searchQuery}
        onBuildUsecase={onBuildUsecase}
      />
    </>
  );
};

export default AppsAndCategories;
