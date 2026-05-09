import { getUserById } from "@/services/proxyServices";
import { useEffect, useState } from "react";
import { fetchBlogs } from "@/utils/apis/blogApis";
import { useRouter } from "next/router";
import { nameToSlugName } from "@/utils/utils";
import UserProfileHeader from "@/components/UserProfileHeader/UserProfileHeader";
import UserBlogList from "@/components/UserBlogList/UserBlogList";
import  {useUser}  from "@/context/UserContext";

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


  return (
    <div className="container-lg py-3 px-4" style={{ maxWidth: "60rem", margin: "auto" }}>
      <UserProfileHeader user={user} currentUser={currentUser} count={count} />
      <div className="mt-4">
        <UserBlogList 
          blogs={blogs} 
          title={`Explore Blogs by ${user.name.trim().split(" ")[0]}`} 
          isLoading={isLoading} 
          userName={user.name} 
        />
      </div>
    </div>
  );
}
