import React from "react";
import Skeleton from "react-loading-skeleton";
import { nameToSlugName } from "@/utils/utils";
import AccentBar from "../AccentBar/AccentBar";
import styles from "./UserBlogList.module.scss";

const UserBlogList = ({ blogs, title, isLoading, userName }) => {
  if (isLoading) {
    return (
      <section className="mb-5">
        <h2
          className="h4 fw-bold ps-3 mb-4"
          style={{ fontFamily: "var(--title-font)" }}
        >
          {title}
        </h2>
        <div className="row row-cols-1 g-4 px-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="col">
              <div className="border p-4 h-100 bg-white shadow-sm">
                <Skeleton height={30} width="80%" className="mb-3" />
                <div className="d-flex gap-2 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} circle height={26} width={26} />
                  ))}
                </div>
                <div className="d-flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} height={20} width={60} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return blogs?.length > 0 ? (
    <section className="mb-5">
      <h2
        className="h4 fw-bold d-flex align-items-center gap-2 mb-4"
        style={{ fontFamily: "var(--title-font)" }}
      >
        <AccentBar />
        {title}
      </h2>
      <div className="row row-cols-1 g-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="col my-2">
            <a
              href={`/discovery/blog/${blog.id}/${blog?.meta?.category ? `${nameToSlugName(blog.meta.category)}/` : ""}${blog?.slugName ? nameToSlugName(blog.slugName) : ""}`}
              className={`${styles.blogCard} d-block border p-4 h-100 bg-white text-decoration-none text-dark shadow-sm`}
              style={{ borderLeft: "4px solid #a8200d" }}
            >
              <h3
                className="h5 fw-bold mb-3"
                style={{ fontFamily: "var(--title-font)", lineHeight: "1.4" }}
              >
                {blog.title}
              </h3>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {Object.entries(blog?.apps || {})
                  .slice(0, 10)
                  .map(([appName, { iconUrl }], index) => (
                    <img
                      key={index}
                      src={iconUrl}
                      alt={appName}
                      width="26"
                      height="26"
                      className="object-fit-contain bg-light p-1 border"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://www.google.com/s2/favicons?domain=${appName.toLowerCase().replace(/\s+/g, "")}.com&sz=32`;
                      }}
                    />
                  ))}
              </div>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {blog.tags?.slice(0, 4).map((tag, index) => (
                  <React.Fragment key={index}>
                    <span
                      className="text-secondary"
                      style={{ fontSize: "12px" }}
                    >
                      {tag}
                    </span>
                    {index < Math.min(blog.tags.length, 4) - 1 && (
                      <span
                        className="text-secondary opacity-50"
                        style={{ fontSize: "14px" }}
                      >
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  ) : (
    <section className="mb-5">
      <h2
        className="h4 fw-bold ps-3 mb-4"
        style={{ fontFamily: "var(--title-font)" }}
      >
        {title}
      </h2>
      <p className="fs-5 mt-4 ps-3 text-muted fst-italic">
        It seems there are no Apps from {userName} yet! Check back soon for more
        insights and stories.
      </p>
    </section>
  );
};

export default UserBlogList;
