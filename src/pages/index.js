import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash'; 
import Blog from '@/components/Blog/Blog';
import styles from '@/pages/home.module.scss';
import { fetchBlogs } from '@/utils/apis/blogApis';
import Search from '@/components/Search/Search';
import { useUser } from '@/context/UserContext';
import Chatbot from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';
import { dispatchAskAiEvent, dispatchAskAppAiWithAuth, safeParse } from '@/utils/utils';
import { useRouter } from 'next/router';
import Link from 'next/link';
import blogstyle from '@/components/Blog/Blog.module.scss';
import Skeleton from 'react-loading-skeleton';
import { titleSuggestions } from '@/utils/apiHelper';

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
    const divRef = useRef(null);

    useEffect(() => {
      if(!router.isReady || ( isOpen && !searchQuery.length > 0 )) return ;
        const fetchAllBlogs = async () => {
        setSearchQuery(router.query?.search || '')
        setBlogs([]);
        setIsLoading(true);
          try {
              const data = await fetchBlogs(router.query?.search ? `?search=${router.query?.search}` : '');
              if (data.tags) setTags(data.tags);
              setBlogs(data?.blogs);
              if(data?.blogs?.length < 10){
                setIsLoading(true);
                const titles = await titleSuggestions(router.query?.search, data.blogs.map(blog => blog.title));
                setBlogs((prevBlogs) => [...prevBlogs, ...(titles.map(ele => ({dummy: true, title: ele})))]);
                setIsLoading(false);
              }
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
      setIsLoading(true);
      setBlogs([]);
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

    useEffect(() => {
      divRef.current.scrollIntoView();      
    });

  // Conditional blog rendering


  const tagsContainer = ()=>{
    if(!tags?.length || !searchQuery || isLoading) return null;
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
    return (
      <section className={styles.Homesection}>
        {/* <h2 className={"heading " + styles.searchQuery}>{title}</h2> */}
        {tagsContainer()}
        {isLoading && (
          <div className={styles.cardsGrid}>
            {[...Array(10)].map((_, index) => (
              <Skeleton
                className={styles.skeleton}
                height={20}
                width={750}
                style={{ marginBottom: "10px", borderRadius: "20px" }}
                key={index}
              />
            ))}
          </div>
        )}
        <div className={styles.blogsDiv}>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <a
                target={blog.dummy ? '_self' : '_blank'}
                rel="noopener noreferrer"
                href={blog.dummy ? null : `/discovery/blog/${blog.id}`}
                key={blog.id}
                onClick={() => {
                  if (blog.dummy) {
                    handleAskAi(blog.title);
                    setSearchQuery(user ? '' : blog.title);
                  }
                }}
              >
                <h6 className={styles.titleSuggestion + ' ' + (blog.dummy ? styles.dummy : '')}>{blog.title}</h6>
              </a>
            ))
          ) : (
            !isLoading && fallback && (
              <h6 className={styles.titleSuggestion}>
                No results here, hit enter or Ask AI !!!
              </h6>
            )
          )}
        </div>
      </section>
    );    
  }
  
  const handleAskAi = async (prompt) => {
    if(prompt){
      dispatchAskAppAiWithAuth(prompt);
    }else{
      dispatchAskAiEvent(searchQuery);
    }
    setIsOpen(true);
  }
  
  useEffect(()=>{
    if(!user) setIsOpen(false);
  },[user])
  
  return (
    <div className={styles.homePageContainer + ' ' + (searchQuery ? styles.contentToBottom: '')}>
      <div className={styles.homePageDiv}>
        {
          !isOpen && !searchQuery && (
            <>
              <h1 className={styles.homeTitle}>Discover Top Software</h1>
              <p className={styles.homep}>{'Find top software from every category, thoughtfully curated by industry experts and individuals just like you.'}</p>
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
          <Search className={typingStart ? styles.showInBottom :  styles.showInCenter} searchQuery={searchQuery} setSearchQuery={handleSetSearchQuery} handleAskAi = {handleAskAi} placeholder = 'SEARCH WITH AI' messages={messages}/>
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
        <Chatbot bridgeId = {process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE} messages={messages} setMessages = {setMessages} chatId = {chatId} homePage setIsOpen = {setIsOpen} isOpen = {isOpen} searchResults = {searchQuery ? blogs.filter(blog => !blog.dummy) : null}/>
      </div>
      <div ref={divRef}></div>
    </div>
  );
}
