import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash'; 
import Blog from '@/components/Blog/Blog';
import styles from '@/pages/home.module.css';
import { fetchBlogs, SearchBlogs } from '@/utils/apis/blogApis';
import Search from '@/components/Search/Search';
import { useUser } from '@/context/UserContext';
import { safeParse } from './edit/[chatId]';
import Chatbot from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';
import { dispatchAskAiEvent } from '@/utils/utils';
import { useRouter } from 'next/router';

export default function Home() {
    const [userBlogs, setUserBlogs] = useState([]);
    const [otherBlogs, setOtherBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const user = useUser().user;
    const chatId = user?.id || Math.random();
    const router = useRouter();

    useEffect(() => {
        const fetchAllBlogs = async () => {
          if(router.query?.tags) return ;
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

    useEffect(()=>{
      const fetchBlogsByTag = async () => {
        setIsLoading(true);
        try{
          const data = await fetchBlogs(`?tag=${router.query?.tag}`);
          setSearchResults(data);
        }catch(error){
          console.log("error fetching blog by tag ", error);
        }finally{
          setIsLoading(false);
        }
      }
      if(router.query?.tag){
        setSearchQuery(`#${router.query?.tag}`)
        fetchBlogsByTag();
      }
    },[router.query])
    const fetchSearchBlogs = useCallback(async () => {
        if (searchQuery) {
            try {
                setIsLoading(true);
                const filteredResults = await SearchBlogs(searchQuery);
                setSearchResults(filteredResults);
            } catch (error) {
                console.log("Error getting search results ",error);
            }finally{
                setIsLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const debouncedFetchBlogs = useCallback(debounce(fetchSearchBlogs, 400), [fetchSearchBlogs]);

    useEffect(() => {
      if(searchQuery.startsWith("#")) return ;
      setIsLoading(true);
      debouncedFetchBlogs();
      if ( !searchQuery?.length && otherBlogs.length>0) {
          setIsLoading(false)
      }
        return () => {
            debouncedFetchBlogs.cancel(); 
        };
    }, [searchQuery, isOpen, debouncedFetchBlogs]);

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
          <h2 className={styles.homeh2}>{title}</h2>
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
        <p className={styles.noData}>No results here! Press Enter or hit Ask AI</p>
      </section>
    ) 
  )
  }
    const handleAskAi = async () => {
      dispatchAskAiEvent(searchQuery);
      setIsOpen(true);
    }
    useEffect(()=>{
      if(!user) setIsOpen(false);
    },[user])
    return (
        <>
          {
            !isOpen && (
              <>
                <h1 className={styles.homeTitle}>Get the Best Business Tools – Handpicked by Real Businesses Like Yours</h1>
                <p className={styles.homep}>{'Discover top tools curated by real businesses that have been where you are. Tailored to your industry, size, location, and goals – whether you\'re scaling up, boosting efficiency, or cutting costs, find the tools that fit your needs without the hassle.'}</p>
              </>
            )
          }            
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
          <Chatbot bridgeId = {process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE} messages={messages} setMessages = {setMessages} chatId = {chatId} homePage setIsOpen = {setIsOpen} isOpen = {isOpen} searchResults = {searchQuery ? searchResults : null}/>
        </>
    );
}
