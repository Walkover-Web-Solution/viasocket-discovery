import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash'; 
import Blog from '@/components/Blog/Blog';
import styles from '@/pages/home.module.css';
import { fetchBlogs } from '@/utils/apis/blogApis';
import Search from '@/components/Search/Search';
import { useUser } from '@/context/UserContext';
import { safeParse } from './edit/[chatId]';
import Chatbot from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';
import { dispatchAskAiEvent } from '@/utils/utils';
import { useRouter } from 'next/router';
import Link from 'next/link';
import blogstyle from '@/components/Blog/Blog.module.scss';

export default function Home() {
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tags , setTags]= useState([])
    const user = useUser().user;
    const chatId = user?.id || Math.random();
    const router = useRouter();

    useEffect(() => {
      if(!router.isReady || ( isOpen && !searchQuery.length > 0 )) return ;
        const fetchAllBlogs = async () => {
        setSearchQuery(router.query?.search || '')
        setIsLoading(true);
        
          try {
              const data = await fetchBlogs(router.query?.search ? `?search=${router.query?.search}` :'');
              if (data.tags)setTags(data.tags);
              setBlogs(data?.blogs);
          } catch (error) {
              console.error('Error fetching blogs:', error);
          }finally{
            setIsLoading(false);

          }
        };

        fetchAllBlogs();
    }, [ router.query?.search, router.isReady ]);

    const fetchSearchBlogs = useCallback(async () => {
      if(searchQuery !== '') router.replace({ query : { search : searchQuery } },undefined,{shallow:true})
      else router.replace('/',undefined,{shallow:true})
    }, [searchQuery]);

    const debouncedFetchBlogs = useCallback(debounce(fetchSearchBlogs, 400), [fetchSearchBlogs]);

    useEffect(() => {
      setIsLoading(true)
      debouncedFetchBlogs();
        return () => {
            debouncedFetchBlogs.cancel(); 
        };
    }, [searchQuery, isOpen]);

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


  const tagsContainer = ()=>{
    return  (
    <div className={styles.searchTags}>
    {tags.map((tag, index) => (
        <Link
          key={index}
          href={`/?search=%23${tag}`}
          className={`${blogstyle.tag} ${blogstyle[tag.toLowerCase()]}`}
        >
          {tag}
        </Link>
    ))}
  </div>
  )
  }
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
        <div>
        <h2 className={styles.homeh2}>{title}</h2>
        {tagsContainer()}
        </div>
       
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
                  renderBlogsSection(blogs, searchQuery, true)
              ) : (
                  <>
                      {renderBlogsSection(blogs)}
                  </>
              )}
          </div>
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleAskAi = {handleAskAi} placeholder = 'Search Categories or Ask AI...' />
          <Chatbot bridgeId = {process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE} messages={messages} setMessages = {setMessages} chatId = {chatId} homePage setIsOpen = {setIsOpen} isOpen = {isOpen} searchResults = {searchQuery ? blogs : null}/>
        </>
    );
}
