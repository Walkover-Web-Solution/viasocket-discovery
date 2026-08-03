import { useState, useEffect } from "react";
import AppsList from "./AppsList";
import { fetchCategories } from "@/utils/apis/appsApis";

const AppsAndCategories = ({
  onSelectedAppsChange,
  selectedApps,
  searchQuery,
  onAppsLoaded,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const INITIAL_CATEGORY_COUNT = 6;

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 my-4 w-75">
        <button
          className={`btn btn-sm ${selectedCategory === "All" ? "btn-dark" : "btn-outline-secondary"}`}
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
              className={`btn btn-sm ${selectedCategory === category.name ? "btn-dark" : "btn-outline-secondary"}`}
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
        onAppsLoaded={onAppsLoaded}
      />
    </>
  );
};

export default AppsAndCategories;
