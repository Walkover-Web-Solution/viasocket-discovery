import { getUserById } from "@/services/proxyServices"; 
import Avatar from '@mui/material/Avatar';
import styles from './UserPage.module.css'; 
import BlogCard from "@/components/Blog/Blog";
import { useEffect, useState } from "react";
import { fetchBlogs } from "@/utils/apis/blogApis";

export async function getServerSideProps(context) {
  const { userId } = context.params;
  const user = await getUserById(userId);

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: { user },
  };
}

export default function UserPage({ user }) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(()=>{
    const fetchData = async ()=>{
      const data = await fetchBlogs(`?userId=${user.id}`);
      setBlogs(data.blogs);
      setIsLoading(false);
    }
    fetchData();
  }, [user.id]); 


  const renderBlogsSection = (blogs, title, fallback) => {
    if (isLoading) {
      return (
        <section className={styles.Homesection}>
          <h2 className={styles.homeh2}>{title}</h2>
          <div className={styles.cardsGrid}>
            <BlogCard isLoading={isLoading} />
            <BlogCard isLoading={isLoading} />
            <BlogCard isLoading={isLoading} />
            <BlogCard isLoading={isLoading} />
          </div>
        </section>
      )
    }

    return (
      blogs?.length > 0 ? (
        <section className={styles.Homesection}>
           <div>
            <h2 className={styles.homeh2}>{title}</h2>
          </div> 

          <div className={styles.cardsGrid}>
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      ):(
        <section className={styles.Homesection}>
        <h2 className={styles.homeh2}>{title}</h2>
        <p className={styles.noData}>It seems there are no Apps from {user.name} yet! Check back soon for more insights and stories.</p>
      </section>
      )
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <div className={styles.author}>
        <Avatar className={styles.avatar}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <span className={styles.name}><strong>{user.name}</strong></span>
        </div>
        <p className={styles.contribution}>{blogs.length} blog{blogs.length !== 1 ? 's' : ''} contributed</p>
      </div>
      <div className={styles.postHeaderDiv}>
          {renderBlogsSection(blogs, `Exploring Apps by ${user.name}`)}
      </div>
    </div>
  );
}
