import styles from "./RelatedBlogs.module.scss";

const RelatedBlogs = ({ relatedBlogs }) => {
  if (!relatedBlogs || relatedBlogs.length === 0) return null;

  return (
    <section className="py-5">
      <h3 className="mb-4">Related Discoveries</h3>
      <div className="row">
        {relatedBlogs.map((blog) => (
          <div className="col-4 p-0" key={blog.id}>
            <a
              target="_blank"
              href={`/discovery/blog/${blog.id}/${blog.slugName}`}
              className={`${styles.relatedCard} d-block p-4 border h-100 text-decoration-none text-dark`}
            >
              <span
                className="d-block fw-bold text-uppercase mb-3 border bg-light p-2"
                style={{
                  width: "fit-content",
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                }}
              >
                {blog?.meta?.category || "Discovery"}
              </span>
              <span className="d-block fw-semibold text-truncate">{blog.title}</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedBlogs;
