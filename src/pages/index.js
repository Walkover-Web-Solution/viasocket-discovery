import { parseCookies } from 'nookies';
import { useState, useEffect, useRef } from 'react';
import Blog from '@/components/Blog/Blog';
import styles from '@/pages/home.module.css';
import { fetchBlogs, SearchBlogs } from '@/utils/apis/blogApis';
import Search from '@/components/Search/Search';
import { useUser } from '@/context/UserContext';
import { safeParse } from './edit/[chatId]';
import Chatbot from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';
import { dispatchAskAiEvent } from '@/utils/utils';

export async function getServerSideProps(context) {
    let userBlogs = [];
    let otherBlogs = [];
    try {
        const cookies = parseCookies(context);
        const token = cookies[process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT];
        const data = await fetchBlogs(token);
        userBlogs = data?.data?.userBlogs;
        otherBlogs = data?.data?.otherBlogs;
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
    return {
        props: {
          userBlogs: userBlogs || [],
          otherBlogs: otherBlogs || []
        }
    };
}


export default function Home({ userBlogs, otherBlogs }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const user = useUser().user;
    // const chatId = useRef(user?.id  ||   Math.random());
    const chatId = (user?.id  ||   Math.random());
    useEffect(() => {
        const fetchBlogs = async () => {
            if (searchQuery) {
                const filteredResults = await SearchBlogs(searchQuery);
                setSearchResults(filteredResults);
            } else {
                setSearchResults([]);
            }
        };
        fetchBlogs();
    }, [searchQuery]);
    
    useEffect(() => {
      (async () => {
        const chatHistoryData = await getAllPreviousMessages(chatId,process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE).catch(err => null);
        const prevMessages = chatHistoryData.data
        .filter((chat) => chat.role === "user" || chat.role === "assistant")
        .map((chat) => ({
          role: chat.role,
          content:
            chat.role === "user" ? chat.content : safeParse(chat.content),
        }));
        setMessages(prevMessages);
      })();
    }, [user]);


  // Conditional blog rendering
  const renderBlogsSection = (blogs, title, fallback) => (
    blogs?.length > 0 ? (
      <section className={styles.Homesection}>
        <h2 className={styles.homeh2}>{title}</h2>
        <div className={styles.cardsGrid}>
          {blogs.map((blog) => (
            <Blog key={blog._id} blog={blog} />
          ))}
        </div>
      </section>
    ): fallback ? (
      <section className={styles.Homesection}>
        <h2 className={styles.homeh2}>{title}</h2>
        <p className={styles.noData}>Nothing Found !!!</p>
      </section>
    ) : null
  );
    const handleAskAi = async () => {
      dispatchAskAiEvent(searchQuery);
      setIsOpen(true);
    }
    return (
        <>            
          <div className={styles.postHeaderDiv}>
              {searchQuery && !isOpen ? (
                  renderBlogsSection(searchResults, searchQuery, true)
              ) : (
                  <>
                      {renderBlogsSection(userBlogs)}
                      {renderBlogsSection(otherBlogs)}
                  </>
              )}
          </div>
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleAskAi = {handleAskAi} placeholder = 'Search Categories or Ask AI...' />
          <Chatbot bridgeId = {process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE} messages={messages} setMessages = {setMessages} chatId = {chatId} homePage setIsOpen = {setIsOpen} isOpen = {isOpen}/>
        </>
    );
}
