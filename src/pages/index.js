// import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';
import Blog from '@/components/Blog/Blog';
import styles from '@/pages/home.module.css';
import { fetchBlogs, SearchBlogs } from '@/utils/apis/blogApis';
import Search from '@/components/Search/Search';
import { useUser } from '@/context/UserContext';
import { safeParse } from './edit/[chatId]';
import Chatbot from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';
import { dispatchAskAiEvent } from '@/utils/utils';

export default function Home() {
    const [userBlogs, setUserBlogs] = useState([]);
    const [otherBlogs, setOtherBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const user = useUser().user;
    const [timeoutId, setTimeoutId] = useState(null);
    const chatId = user?.id || Math.random();

    useEffect(() => {
        const fetchAllBlogs = async () => {
          setIsLoading(true);
            try {
                const data = await fetchBlogs();
                setUserBlogs(data?.userBlogs || []);
                setOtherBlogs(data?.otherBlogs || []);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }finally{
              setIsLoading(false);
            }
        };

        fetchAllBlogs();
    }, []);

    useEffect(() => {
      const debounce = (func, delay) => {
        setIsLoading(true);
        return (...args) => {
          if (timeoutId) {
            if(searchQuery?.length === 0) {
              setIsLoading(false)
            }
            clearTimeout(timeoutId);
          }
          const id = setTimeout(() => {
            func(...args);
          }, delay)
           setTimeoutId(id)
        };
      };
        const fetchBlogs = async () => {
            if (searchQuery) {
              try {
                setIsLoading(true);
                const filteredResults = await SearchBlogs(searchQuery);
                setSearchResults(filteredResults);
              } catch (error) {
                console.log("error getting search")
              }finally{
                setIsLoading(false)
              }
            } else {
                setSearchResults([]);
            }
        };
        const debouncedFetchBlogs = debounce(fetchBlogs, 300);

        if (!isOpen) {
          debouncedFetchBlogs(); 
        }
        return () => {
          clearTimeout(debouncedFetchBlogs);
      };

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
  const renderBlogsSection = (blogs, title, fallback) => {
    if(isLoading){
      return  (
        <section className={styles.Homesection}>
          <h2 className={styles.homeh2}></h2>
          <div className={styles.cardsGrid}>
            <Blog isLoading={isLoading} /> 
            <Blog isLoading={isLoading} /> 
            <Blog isLoading={isLoading} /> 
            <Blog isLoading={isLoading} /> 
          </div>
        </section>
      )
    }

    return (
    blogs?.length > 0 ? (
      <section className={styles.Homesection}>
        <h2 className={styles.homeh2}>{title}</h2>
        <div className={styles.cardsGrid}>
          {blogs.map((blog) => (
            <Blog key={blog._id} blog={blog} />
          ))}
        </div>
      </section>
    ): fallback && (
      <section className={styles.Homesection}>
        <h2 className={styles.homeh2}>{title}</h2>
        <p className={styles.noData}>Nothing Found !!!</p>
      </section>
    ) 
  )
  }
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
