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
import { safeParse } from '@/pages/edit/[chatId]';
import Popup from '@/components/PopupModel/PopupModel';
import { toast } from 'react-toastify';
import { compareBlogs } from '@/utils/apis/chatbotapis';
import { publishBlog, updateBlog } from '@/utils/apis/blogApis';
import { useUser } from '@/context/UserContext';
import { dispatchAskAiEvent } from '@/utils/utils';



export async function getServerSideProps(context) {
  const { blogId } = context.params;
  const props = {};
  try {
    const blog = await blogServices.getBlogById(blogId[0]);
    console.time("getUserById");
    const user = await getUserById(blog?.createdBy);
    console.timeEnd("getUserById");
    props.blog = blog;
    props.user = user;
  } catch (error) {
    console.error('Error fetching blog data:', error); // Return an empty object if there's an error
  }
  return { props };
}

export default function BlogPage({ blog, user}) {
  const [blogData, setBlogData] = useState(blog);
  const [oldBlog,setOldBlog]=useState('');
  const [integrations, setIntegrations] = useState(null);
  const router= useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isPopupOpen, setIsPopUpOpen] = useState(false);
  const currentUser = useUser().user;
  let blogDataToSend = { ...blogData };
  delete blogDataToSend._id;
  delete blogDataToSend.__v;
  delete blogDataToSend.id;
  delete blogDataToSend.apps;
  delete blogDataToSend.createdBy;
  delete blogDataToSend.createdAt;
  const handleAskAi = async () => {
    setIsOpen(true);
    dispatchAskAiEvent(searchQuery);
    setSearchQuery('');
  }

  const formateTitle = (title) => {
    return title?.toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    if (blog) {
      router.replace(
        {
          pathname: `/blog/${blog.id}/${formateTitle(blog.slugName)}`,
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
    (async () => {
      const chatHistoryData = await getAllPreviousMessages(blog.id, process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE);
      const prevMessages = chatHistoryData.data
      .filter((chat) => chat.role === "user" || chat.role === "assistant")
      .map((chat) => ({
        role: chat.role,
        content:
          chat.role === "user" ? chat.content : safeParse(chat.content),
      }));
      setMessages(prevMessages);
    })();
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if(lastMessage?.role == 'assistant'){
      const content = lastMessage.content;
      if(content?.blog)
        setBlogData(content.blog);
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
    <div>
      <div className={`${styles.container} ${isOpen ? styles.containerOpen : ''}`}>
        <AIresponse blogData={blogData} user={user} integrations = {integrations}/>
        {isOpen && <button onClick={handlePublish} className = {styles.publishButton}>Publish Changes</button>}
      </div>
      <Chatbot bridgeId = {process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE} messages={messages} setMessages = {setMessages} chatId = {blog.id} setBlogData = {setBlogData} variables = {{blogData : blogDataToSend}} setIsOpen = {setIsOpen} isOpen={isOpen}/>
      {!isOpen && <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleAskAi = {handleAskAi} placeholder = 'Follow up if any query with AI...' />}
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopUpOpen(false)} handlePublish={handleNewPublish} />
    </div>
  );
}
