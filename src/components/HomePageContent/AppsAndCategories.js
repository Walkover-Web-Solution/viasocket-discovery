import { useState } from "react";
import AppsList from "./AppsList";

const AppsAndCategories = ({ categories = [], onSelectedAppsChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const INITIAL_CATEGORY_COUNT = 15;

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, INITIAL_CATEGORY_COUNT);

  return (
    <>
      <div className="d-flex flex-wrap gap-2 my-4 w-75">
        <button
          className={`btn btn-sm ${selectedCategory === "All" ? "btn-dark" : "btn-outline-secondary"}`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>
        {visibleCategories.map((category) => (
          <button
            key={category.slug || category.name}
            className={`btn btn-sm ${selectedCategory === category.name ? "btn-dark" : "btn-outline-secondary"}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
        {categories.length > INITIAL_CATEGORY_COUNT && (
          <button
            className="btn btn-sm btn-link text-decoration-none"
            onClick={() => setShowAllCategories((prev) => !prev)}
          >
            {showAllCategories ? "Less" : "More"}
          </button>
        )}
      </div>
      <AppsList
        selectedCategory={selectedCategory}
        onSelectedAppsChange={onSelectedAppsChange}
      />
    </>
  );
};

export default AppsAndCategories;
