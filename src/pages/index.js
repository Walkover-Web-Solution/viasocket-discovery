import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash'; 
import Blog from '@/components/Blog/Blog';
import styles from '@/pages/home.module.css';
import { fetchBlogs } from '@/utils/apis/blogApis';
import Search from '@/components/Search/Search';
import { useUser } from '@/context/UserContext';
import Chatbot from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';
import { dispatchAskAiEvent, safeParse } from '@/utils/utils';
import { useRouter } from 'next/router';
import { SettingsSystemDaydreamSharp } from '@mui/icons-material';
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
    const [typingStart, setTypingStart] = useState(false);
    const popularTags = ["Customer Relationship Management", "Project Management", "Database Management", "Sales and Marketing", "Human Resource", "Finance Hub"]

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
    
    function handleSetSearchQuery(query){
      setSearchQuery(query);
    }
    
    useEffect(() => {
      if(!typingStart && searchQuery?.length) setTypingStart(true);
      setIsLoading(true)
      debouncedFetchBlogs();
      return () => {
            debouncedFetchBlogs.cancel(); 
        };
    }, [searchQuery, isOpen]);

    useEffect(() => {
      if(!user) return;
      (async () => {
        const indexes = [];
        const chatHistoryData = await getAllPreviousMessages(chatId,process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE).catch(err => null);
        let prevMessages = chatHistoryData?.data
        .filter((chat) => chat.role === "user" || chat.role === "assistant")
        .map((chat,index) => {
          if(chat['raw_data.variables']?.retry) indexes.push(index);
          return ({
          role: chat.role,
          content:
            chat.role === "user" ? chat.content : safeParse(chat.content,process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE,chatId),
        })});
        for (let i = indexes.length-1; i >=0 ; i--) {
          const currentIndex = indexes[i];
          prevMessages.splice(currentIndex , 1);
          prevMessages.splice(currentIndex-1 , 1);
        }
        setMessages(prevMessages);
      })();
    }, [user]);


  // Conditional blog rendering


  const tagsContainer = ()=>{
    if(!tags?.length || !searchQuery) return null;
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
        <div className = {styles.homesubdiv}>
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
                <h1 className={styles.homeTitle}>Find Your Ideal Tool in Seconds</h1>
                <p className={styles.homep}>{'Follow Up With Al For Personalized Insights And Automated Recommendations Based On Real Professionals'}</p>
              </>
            )
          }     
          { typingStart &&       
            <div className={styles.postHeaderDiv}>
                {searchQuery && !isOpen ? (
                    renderBlogsSection(blogs, searchQuery, true)
                ) : (
                    <>
                        {renderBlogsSection(blogs)}
                    </>
                )}
            </div>
          }
          <div className={typingStart ? '' : styles.searchDiv}>
            <Search className={typingStart ? styles.showInBottom :  styles.showInCenter} searchQuery={searchQuery} setSearchQuery={handleSetSearchQuery} handleAskAi = {handleAskAi} placeholder = 'SEARCH WITH AI'/>
            {
              !typingStart && 
              <div className = {styles.popularTagsDiv}>
                {popularTags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/?search=${tag}`}
                  className={`${blogstyle.tag} ${blogstyle[tag.toLowerCase()]}`}
                >
                  {tag}
                </Link>
              ))}
              </div>
            }
          </div>
          <Chatbot bridgeId = {process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE} messages={messages} setMessages = {setMessages} chatId = {chatId} homePage setIsOpen = {setIsOpen} isOpen = {isOpen} searchResults = {searchQuery ? blogs : null}/>
        </>
    );
}
