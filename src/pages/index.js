import { parseCookies } from 'nookies';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Blog from '@/components/Blog/Blog';
import styles from '@/pages/home.module.css';
import { fetchBlogs, publishBlog, SearchBlogs } from '@/utils/apis/blogApis';
import AskAi from '@/components/AskAi/AskAi';
import Search from '@/components/Search/Search';
import { useUser } from '@/context/UserContext';
import { safeParse } from './edit/[chatId]';
import Chatbot, { sendMessageToChatBot } from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';


export function dispatchAskAiEvent(userMessage) {
  const event = new CustomEvent('askAppAi', {
      detail: userMessage
  });
  window.dispatchEvent(event); // Emit the event globally
  console.log("Emitted the Event...")
};
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
            userBlogs,
            otherBlogs
        }
    };
}


export default function Home({ userBlogs, otherBlogs }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const user = useUser().user;
    const chatId = useRef(user?.id  ||   Math.random());
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
        const chatHistoryData = await getAllPreviousMessages(chatId.current);
        const prevMessages = chatHistoryData.data.map((chat) => ({
          role: chat.role,
          content:
            chat.role === "user" ? chat.content : safeParse(chat.content),
        }));
        setMessages(prevMessages);
      })();
    }, []);


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
      console.log(chatId);
      dispatchAskAiEvent(searchQuery);
      setIsOpen(true);
      await sendMessageToChatBot(searchQuery, messages, setMessages, chatId.current, process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE);
    }
    return (
        <>            
 ̰         <div className={styles.postHeaderDiv}>
              {searchQuery && !isOpen ? (
                  renderBlogsSection(searchResults, 'Search Results', true)
              ) : (
                  <>
                      {renderBlogsSection(userBlogs, 'Your categories')}
                      {renderBlogsSection(otherBlogs, 'Top Categories')}
                  </>
              )}
          </div>
          {!isOpen && <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleAskAi = {handleAskAi} />}
          {isOpen && <Chatbot bridgeId = {process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE} messages={messages} setMessages = {setMessages} chatId = {chatId.current} homePage />}
        </>
    );
}
