import styles from '@/components/Blog/Blog.module.css';

export default function BlogCard({ blog }) {
  return (
    <div key={blog._id} className={styles.card}>
      <a href={`/discovery/blog/${blog._id}`} target="_blank" rel="noopener noreferrer">
        <h3>{blog.title}</h3>
        <p>{blog.blog.find(section => section.section === 'introduction')?.content}</p>
        <div className={styles.tagsContainer}>
          {blog.tags.map((tag, index) => (
            <button
              key={index}
              className={`${styles.tag} ${styles[tag.toLowerCase()]}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </a>
    </div>
  );
}

