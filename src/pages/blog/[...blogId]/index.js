import AIresponse from '@/components/AIresponse/AIresponse';
import blogServices from '@/services/blogServices';
import { fetchIntegrations } from '@/utils/apiHelper';
import { getUserById } from '@/services/proxyServices';
import styles from './blogPage.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Search from '@/components/Search/Search';
import Chatbot from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';
import Popup from '@/components/PopupModel/PopupModel';
import { toast } from 'react-toastify';
import { compareBlogs } from '@/utils/apis/chatbotapis';
import { publishBlog, updateBlog } from '@/utils/apis/blogApis';
import { useUser } from '@/context/UserContext';
import { dispatchAskAiEvent, nameToSlugName, safeParse } from '@/utils/utils';
import BlogCard from '@/components/Blog/Blog';
import { getCurrentEnvironment } from '@/utils/storageHelper';
import Head from 'next/head';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box } from '@mui/system';
import Image from 'next/image';
import diamondImage from  "../../../static/images/diamond.svg";
import Link from 'next/link';


export async function getServerSideProps(context) {
  const { blogId } = context.params;
  const props = {};
  try {
    const blog = await blogServices.getBlogById(blogId[0],getCurrentEnvironment());
    if (!blog) {
      return {
        notFound : true
      }
    }
    const relatedBlogsPromise = blogServices.searchBlogsByTags(blog.tags, blogId[0], blog?.meta?.category, getCurrentEnvironment());
    const appKeys = Object.keys(blog.apps);
    const appBlogsPromise = blogServices.searchBlogsByApps(appKeys, blogId[0], getCurrentEnvironment());
    const usersPromise = Promise.all(
      blog?.createdBy.map(async (userId) => {
        try {
          return await getUserById(userId);
        } catch (error) {
          console.error(`Error fetching user data for userId: ${userId}`, error);
          return null;
        }
      }));
    const [relatedBlogs, appBlogs, users] = await Promise.all([relatedBlogsPromise, appBlogsPromise, usersPromise]);
    const filteredUsers = users.filter(user => user !== null);

    props.blog = blog;
    props.users = filteredUsers;
    props.relatedBlogs = relatedBlogs;
    props.appBlogs = appBlogs[0];
  } catch (error) {
    console.error('Error fetching blog data:', error); // Return an empty object if there's an error
  }
  return { props };
}

export default function BlogPage({ blog, users, relatedBlogs, appBlogs}) {
  const [blogData, setBlogData] = useState(blog);
  const [oldBlog,setOldBlog]=useState('');
  const [integrations, setIntegrations] = useState(null);
  const router= useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isPopupOpen, setIsPopUpOpen] = useState(false);
  const currentUser = useUser().user;
  const blogDataToSend = { 
    title: blogData?.title,
    tags: blogData?.tags, 
    blog: blogData?.blog, 
    meta: blogData?.meta
  };
  const handleAskAi = async () => {
    setIsOpen(true);
    dispatchAskAiEvent(searchQuery);
    setSearchQuery('');
  }

 

  useEffect(() => {
    if (blog) {
      router.replace(
        {
          pathname: `/blog/${blog.id}/${nameToSlugName(blog?.meta?.category || '')}/${nameToSlugName(blog.slugName)}`,
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
      const appKeys = Object.keys(blog.apps);
      getData(appKeys)
    }
  }, [blog?.apps]);

  useEffect(() => {
    if(!currentUser?.id) return ;
    (async () => {
      const indexes = [];
      const chatHistoryData = await getAllPreviousMessages(`${blog.id}${currentUser?.id}`, process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE);
      let prevMessages = chatHistoryData.data
      .filter((chat) => chat.role === "user" || chat.role === "assistant")
      .map((chat,index) => {
        if(chat['raw_data.variables']?.retry) indexes.push(index);
        return({
        role: chat.role,
        content:
          chat.role === "user" ? chat.content : safeParse(chat.content,process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE,`${blog.id}${currentUser?.id}`),
      })});
      for (let i = indexes.length-1; i >=0 ; i--) {
        const currentIndex = indexes[i];
        prevMessages.splice(currentIndex , 1);
        prevMessages.splice(currentIndex-1 , 1);
      }
      setMessages(prevMessages);
    })();
  }, [currentUser?.id]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if(lastMessage?.role == 'assistant'){
      const content = lastMessage.content;
      if(content?.blog){
        setBlogData({...content.blog, apps: blogData.apps});
        if( !users.find((user) => user.id === currentUser.id)) {
          users.push({ id : currentUser.id , name : currentUser.name })
        }
      }
    }
  }, [messages])
  useEffect(()=>{
    if(!currentUser) {
      setIsOpen(false);
    }
  },[currentUser])

  const handlePublish = async () => {
    const blogDataToPublish = {
      ...blogData,
      published: true,
    }
    try {
      const res = await compareBlogs(
        {
          variables : {
            current_blog: (oldBlog?.blog),
            updated_blog: (blogData?.blog),
          }
        })
      if (!oldBlog || JSON.parse(res?.content)?.ans === 'yes'){
        await updateBlog(blog.id, blogDataToPublish);
        setOldBlog(blogData);
        toast.success('Blog updated successfully!');
      } else {
        setIsPopUpOpen(true);
      }
    } catch (error) {
      console.error('Failed to publish blog:', error);
      toast.error('An error occurred while publishing the blog: ' + error.message);
    }
  };
  const handleNewPublish = async () => {
    const blogDataToPublish = {
      ...blogData,
      published: true
    };
    try {
      const data = await publishBlog(blogDataToPublish);
      setOldBlog(blogData);
      router.push(`/blog/${data.id}`);
      toast.success('Blog published successfully!');
    } catch (error) {
      console.error('Failed to publish blog:', error);
      toast.error('An error occurred while publishing the blog: ' + error.message);
    } finally {
      setIsPopUpOpen(false)
    }
  };

  return (
    <>
      <Head>
        <meta name="description" content={blog.title}/>
        <meta name="author" content={users.find(user => user.id === blog.createdBy[0])?.name} />
        <meta name="keywords" content={[...blog.tags, ...blog.meta.SEOKeywords].join(', ')} />
      </Head>
      <div>
        <div className={`${styles.container} ${isOpen ? styles.containerOpen : ''}`}>
          <AIresponse blogData={blogData} users={users} integrations={integrations} appBlogs={appBlogs}/>
          <Box className={styles.searchDiv}>
            <h1>Dive Deeper with AI</h1>
            <p>Want to explore more? Follow up with AI for personalized insights and automated recommendations based on this blog</p>
            <Image src={diamondImage} alt="diamond" className={styles.diamondImageSmall} />
            <Image src={diamondImage} alt="diamond" className={styles.diamondImageLarge} />
            {!isOpen && <Search className={styles.searchBox} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleAskAi={handleAskAi} placeholder='Follow up if any query with AI...' />}
          </Box>
          <div className={styles.tagsContainer}>
            <h3>Related Tags</h3>
            <div className={styles.tagsDiv}>
              {blogData?.tags?.map((tag, index) => (
                <Link
                href={`/?search=%23${tag}`}
                target='_blank'
                key={index}
                className={styles.tag}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          {
            relatedBlogs?.length > 0 && (
              <div className={styles.relatedBlogsDiv}>
                <h3>Related Blogs</h3>
                {relatedBlogs.map((blog) => {
                  return <a target='_blank' href = {`/discovery/blog/${blog.id}/${blog.slugName}}`} className = {styles.blogOnSearch} key = {blog.id}><h4>{blog.title} <ArrowForwardIosIcon className={styles.arrowIcon} sx={{fontSize: '15px'}}/></h4></a>
                  return <BlogCard key={blog.id} blog={blog} className={styles.blogOnSearch} />
                })}
              </div>
            )
          }
          {/* {isOpen && <button onClick={handlePublish} className={styles.publishButton}>Publish Changes</button>} */}
        </div>
        <Chatbot bridgeId={process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE} messages={messages} setMessages={setMessages} chatId={`${blog.id}${currentUser?.id}`} setBlogData={setBlogData} variables={{ blogData: blogDataToSend }} setIsOpen={setIsOpen} isOpen={isOpen} blogId = {blog.id} />
        <Popup isOpen={isPopupOpen} onClose={() => setIsPopUpOpen(false)} handlePublish={handleNewPublish} />
      </div>
    </>
  );
}
