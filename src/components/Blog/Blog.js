import { useRouter } from 'next/router';
import styles from '@/components/Blog/Blog.module.css';


export default function BlogCard({ blog }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${blog._id}`);
  };

  return (
    <div key={blog._id} className={styles.card} onClick={handleClick}>
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
    </div>
  );
}
