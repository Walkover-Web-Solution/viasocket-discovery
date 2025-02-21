import { getUserById } from "@/services/proxyServices"; 
import Avatar from '@mui/material/Avatar';
import styles from '@/pages/user/UserPage.module.scss'; 
import BlogCard from "@/components/Blog/Blog";
import { useEffect, useState } from "react";
import { fetchBlogs } from "@/utils/apis/blogApis";
import { useRouter } from "next/router";
import { nameToSlugName } from "@/utils/utils";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import UserBioPopup from "@/components/UserBioPopup/UserBioPoup";
import  {useUser}  from "@/context/UserContext";
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';



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
  const [userBioPopup, setUserBioPopup] = useState(false);
  const currentUser = useUser().user;

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
          <div className={styles.authorInfo}>
            <PersonOutlineOutlinedIcon  className={styles.iconStyle}/>
            <h3 className={styles.name}>{user.name}</h3>
            {user?.id === currentUser?.id && (
              <Tooltip title="Update Bio" arrow>
                <EditIcon
                  className={styles.editIcon}
                  onClick={() => setUserBioPopup(true)}
                  style={{ cursor: 'pointer', marginLeft: '8px', alignSelf: 'center' }}
                />
              </Tooltip>
            )}
          </div>
          <UserBioPopup 
            isOpen={userBioPopup}
            onClose={() => setUserBioPopup(false)}
            firstMessage={`Would you like to update your bio? Let us know what details you'd like to change or add, and we'll update it accordingly while keeping your existing information intact`}  
          />
        </div>
        <p className={styles.contribution}>{user.id == currentUser?.id ? (currentUser?.meta?.bio || '') : (user?.meta?.bio || '')}</p>
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
