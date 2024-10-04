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
import Chatbot, { sendMessageToChatBot } from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';
import { safeParse } from '@/pages/edit/[chatId]';
import { useUser } from '@/context/UserContext';
export async function getServerSideProps(context) {
  const { blogId } = context.params;
  const props = {};
  try {
    const blog = await blogServices.getBlogById(blogId[0]);
    const user = await getUserById(blog?.createdBy);
    props.blog = blog;
    props.user=user;
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
  const [messages, setMessages] = useState([]);
  const currentUser = useUser().user;
  let blogDataToSend = { ...blogData };
  delete blogDataToSend._id;
  delete blogDataToSend.__v;
  delete blogDataToSend.id;
  delete blogDataToSend.apps;
  delete blogDataToSend.createdBy;
  delete blogDataToSend.createdAt;
  const handleAskAi = async () => {
    // dispatchAskAiEvent(searchQuery);
    setIsOpen(true);
    await sendMessageToChatBot(searchQuery, messages, setMessages, blog.id, process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE);
  }
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
        setBlogData(content?.blog);
    }
  }, [messages])

  return (
    <div>
      <div className={`${styles.container} ${isOpen ? styles.containerOpen : ''}`}>
        <AIresponse blogData={blogData} user={user} integrations = {integrations}/>
        {isOpen && <button className = {styles.publishButton}>Publish Changes</button>}
      </div>
      {isOpen && <Chatbot bridgeId = {process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE} messages={messages} setMessages = {setMessages} chatId = {blog.id} setBlogData = {setBlogData} variables = {{blogData : blogDataToSend}}/>}   
      {!isOpen && currentUser && <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleAskAi = {handleAskAi} />}
      {/* {isOpen && <AskAi searchQuery={searchQuery} blog = {blogData} setBlogData = {setBlogData} />} */}
      {/* {isOpen && <ChatBot chatId={blog?.id} isOpen={true} searchQuery={searchQuery} blog = {blog} bridgeId = {bridgeId}/> */}
    </div>
  );
}
