const RelatedBlogs = ({ relatedBlogs }) => {
  if (!relatedBlogs || relatedBlogs.length === 0) return null;

  return (
    <section className="py-5">
      <h3 className="mb-4">Related Discoveries</h3>
      <div className="row g-1">
        {relatedBlogs.map((blog) => (
          <div className="col-4" key={blog.id}>
            <a
              target="_blank"
              href={`/discovery/blog/${blog.id}/${blog.slugName}`}
              className="d-block p-4 border h-100"
              style={{
                background:
                  "linear-gradient(135deg, #dce8ff 0%, #e8d8ff 52%, #ffd8e8 100%)",
              }}
            >
              <span className="d-block fw-bold text-uppercase mb-3">
                {blog?.meta?.category || "Discovery"}
              </span>
              <span className="d-block fw-semibold">{blog.title}</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedBlogs;
