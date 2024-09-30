import AIresponse from '@/components/AIresponse/AIresponse';
import Integrations from '@/components/Integrations/Integrations';
import blogServices from '@/services/blogServices';
import { fetchIntegrations } from '@/utils/apiHelper';
import { getUserById } from '@/services/proxyServices';
import styles from './blogPage.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Search from '@/components/Search/Search';
import AskAi from '@/components/AskAi/AskAi';
export async function getServerSideProps(context) {
  const { blogId } = context.params;
  const props = {};
  try {
    const blog = await blogServices.getBlogById(blogId[0]);
    const user = await getUserById(blog?.createdBy);
    props.blog = blog;
    props.user=user;
    // try{
    //   const integrations = await getIntegrations(blog.apps);
    //   props.integrations = integrations;
    // }catch(error){
    //   console.error('Error fetching integrations:', error);
    // }
  } catch (error) {
    console.error('Error fetching blog data:', error); // Return an empty object if there's an error
  }
  return { props };
}

export default function BlogPage({ blog, user}) {
  const [blogData, setBlogData] = useState(blog);
  const [integrations, setIntegrations] = useState(null);
  const router= useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleAskAi = async () => {
    // try {
    //     const data = await publishBlog();
    //     window.location.href = `discovery/edit/${data.id}`
    // } catch (err) {
    //     window.location.href = `discovery/auth`
    //     toast.error(err.message);
    // }
    setIsOpen(true);
};
  const formateTitle = (title) => {
    return title?.toLowerCase().replace(/\s+/g, '-'); 
  };
  useEffect(() => {
    if (blog) {
      router.replace(
        {
          pathname: `/blog/${blog.id}/${formateTitle(blog.title)}`,
        },
        undefined,
        { shallow: true } // Keeps the page from reloading
      );
    }
  }, [blog?.id]);

  useEffect(() => {
    const getData = async (apps) => {
        const data = await fetchIntegrations(apps)
        setIntegrations(data);
      
    }
    if (blog?.apps) {
      getData(blog?.apps)
    }
  }, [blog?.apps]);
  return (
    <div>
      <div className={`${styles.container} ${isOpen ? styles.containerOpen : ''}`}>
        <AIresponse blogData={blogData} user={user} integrations = {integrations}/>
      </div>
      {!isOpen && <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleAskAi = {handleAskAi} />}
      {isOpen && <AskAi searchQuery={searchQuery} blog = {blogData} setBlogData = {setBlogData} />}
      {/* {isOpen && <ChatBot chatId={blog?.id} isOpen={true} searchQuery={searchQuery} blog = {blog} bridgeId = {bridgeId}/> */}
    </div>
  );
}
