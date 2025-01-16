import { getUserById } from "@/services/proxyServices"; 
import Avatar from '@mui/material/Avatar';
import styles from './UserPage.module.css'; 
import BlogCard from "@/components/Blog/Blog";
import { useEffect, useState } from "react";
import { fetchBlogs } from "@/utils/apis/blogApis";
import { useRouter } from "next/router";
import { nameToSlugName } from "@/utils/utils";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

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
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState({});
  useEffect(() => {
    if (user) {
      router.replace(
        {
          pathname: `/user/${user.id}/${nameToSlugName(user.name)}`,
        },
        undefined,
        { shallow: true } // Keeps the page from reloading
      );
    }
  }, [user?.id]);
  useEffect(()=>{
    const fetchData = async ()=>{
      const data = await fetchBlogs(`?userId=${user.id}`);
      setBlogs(data.blogs);
      setCount(()=>{
        let c = 0;
        data.blogs.forEach((blog)=>{
          if(blog?.createdBy[0] === user.id) c++;
        });
        return {
          createdCount : c ,
          contributed : data.blogs.length - c
        }
      });
      setIsLoading(false);
    }
    fetchData();
  }, [user.id]); 


  const renderBlogsSection = (blogs, title, fallback) => {
    if (isLoading) {
      return (
        <section className={styles.Homesection}>
          <h2 className={styles.homeh2}>
            <b>{title}</b>
            </h2>
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
          <PersonOutlineOutlinedIcon  className={styles.iconStyle}/>
          <h3 className={styles.name}>{user.name}</h3>
        </div>
        <p className={styles.contribution}>{user.meta.bio}</p>
        <b>
        <p className={styles.contribution}>
          {count.createdCount > 0 ?
             `${count.createdCount} blog${blogs.length > 1 ? 's' : ''} `
             : ''
          } 
          {(count.createdCount > 0 && (blogs.length-count.createdCount)>0) 
            ? `and `: ``
          } 
          {count.contributed > 0 ?
            `${count.contributed} contributed ` : ''
          }
          </p>
        </b>
      </div>
      <div className={styles.postHeaderDiv}>
          {renderBlogsSection(blogs, `Explore Blogs by ${user.name.trim().split(" ")[0]}`)}
      </div>
    </div>
  );
}
