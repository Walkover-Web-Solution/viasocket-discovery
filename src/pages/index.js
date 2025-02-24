import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash'; 
import Blog from '@/components/Blog/Blog';
import styles from '@/pages/home.module.scss';
import { createBlog, fetchBlogs } from '@/utils/apis/blogApis';
import Search from '@/components/Search/Search';
import { useUser } from '@/context/UserContext';
import Chatbot from '@/components/ChatBot/ChatBot';
import { getAllPreviousMessages } from '@/utils/apis/chatbotapis';
import { dispatchAskAiEvent, dispatchAskAppAiWithAuth, getAllUsers, safeParse } from '@/utils/utils';
import { useRouter } from 'next/router';
import Link from 'next/link';
import blogstyle from '@/components/Blog/Blog.module.scss';
import Skeleton from 'react-loading-skeleton';
import { titleSuggestions } from '@/utils/apiHelper';
import blogServices from '@/services/blogServices';
import { Avatar } from '@mui/material';
import { toast } from 'react-toastify';
import UnauthorizedPopup from '@/components/UnauthorisedPopup/UnauthorisedPopup';
import UserBioPopup from '@/components/UserBioPopup/UserBioPoup';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Head from 'next/head';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import userStyles from '@/pages/user/UserPage.module.scss'; 
import { getCategoriesFromDbDash } from './api/tags';
import Loader from '@/components/loader/Loader';


export async function getServerSideProps(){
  try{
    const env = process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT;

    const popularUsers = await blogServices.getPopularUsers(env) || [];

    // if (!popularUsers.length) {
    //   return { props: { popularUsers: [], categories: [] } };
    // }

    const userIds = popularUsers.map(user => user._id);

    const [usersResult, categoriesResult] = await Promise.allSettled([
      getAllUsers(userIds),
      getCategoriesFromDbDash(),
    ]);

    let users = usersResult.status === "fulfilled" ? usersResult.value : [];
    const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
    if(categoriesResult.status != "fulfilled") console.error("error getting categories", categoriesResult.reason)

       const enrichedUsers = users
      .map((user, index) => user && ({
        ...user,
        createdBlogs: popularUsers[index]?.createdBlogs || 0,
        contributedBlogs: popularUsers[index]?.contributedBlogs || 0,
      }))
      .filter(Boolean);

    return { props: { popularUsers: enrichedUsers, categories } };
  } catch (error){
    console.error("error on home page serverside props", error)
    return { props: { popularUsers: [], categories: [] } };
  }
}

export default function Home({ popularUsers = [] , categories = []}) {
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoryClicked, setIsCategoryClicked] = useState("not known");
    const [isLoading, setIsLoading] = useState(true);
    const [blogCreating, setBlogCreating] = useState(false);
    const [tags , setTags]= useState([])
    const user = useUser().user;
    const chatId = user?.id || Math.random();
    const router = useRouter();
    const [typingStart, setTypingStart] = useState(false);
    const popularTags = ["Customer Relationship Management", "Project Management", "Database Management", "Sales and Marketing", "Human Resource", "Finance Hub"]
    const divRef = useRef(null);
    const [unAuthPopup, setUnAuthPopup] = useState(false);
    const [userBioPopup, setUserBioPopup] = useState(false);
    const [searchCategories,setSearchCategories] = useState(categories)
    const [allcategories,setAllcategories] = useState(categories)


    useEffect(() => {
      if(!router.isReady || ( isOpen && !searchQuery.length > 0 && !isCategoryClicked)) return ;
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

    useEffect(()=>{
      let filteredCategories = allcategories.filter(item => item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()));
      setSearchCategories(filteredCategories);
      if(filteredCategories.length == 0) setIsCategoryClicked(true)
      if(isCategoryClicked == "not known") setIsCategoryClicked(false);
      if(searchQuery.length == 0 ){ 
        setIsCategoryClicked(false)
        setSearchCategories(allcategories);
      }
    },[searchQuery,isCategoryClicked])
   
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
      if(typingStart)
        divRef.current.scrollIntoView();      
    }, [blogs]);

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
  const highlightText = (text, query) => {
    if (!query) return text;
    const queryWords = query.split(" ");
    const regex = new RegExp(`(${queryWords.join("|")})`, "gi");
    return text.split(regex).map((part, index) =>
      queryWords.some((word) => part.toLowerCase() === word.toLowerCase()) ? (
        <span key={index} className={styles.highlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  
  
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
                style={{ marginBottom: "10px", borderRadius: "20px" ,maxWidth: "80vw"}}
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
                onClick={async () => {
                  if (blog.dummy) {
                    // handleAskAi(blog.title);
                    await handleCreateBlog(blog.title);
                    // setSearchQuery(user ? '' : blog.title);
                  }
                }}
              >
                <h6 className={styles.titleSuggestion + ' ' + (blog.dummy ? styles.dummy : '')}>{highlightText(blog.title, searchQuery)}
                </h6>
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
  const renderCategories = (categories) => {
    return (
      <section className={styles.Homesection}>
        <div className={styles.blogsDiv}>
          {categories.length > 0 && (
            categories.map((category) => (
              <a
                target={'_self'}
                rel="noopener noreferrer"
                href={null}
                key={category.name}
                onClick={async () => {
                  setSearchQuery(category.name);
                  setIsCategoryClicked(true);
                }}
              >
                <h6 className={styles.titleSuggestion}>{category.name}</h6>
              </a>
            ))
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

  async function handleCreateBlog(title) {
    if(!user){
      setUnAuthPopup(true);
      return;
    }
    if(!user?.meta?.bio){
      setUserBioPopup(true);
      return;
    }
    setBlogCreating(true);
    const blogId = await createBlog(title);
    if(!blogId){
      toast.error("We got some Error creating the blog, Please try again")
      setBlogCreating(false);
    }else{
      router.push(`/blog/${blogId}`);
    }
  }
  
  useEffect(()=>{
    if(!user) setIsOpen(false);
  },[user])

  
  return (
    <div className={styles.homePageContainer + ' ' + (searchQuery ? styles.contentToBottom: '') + ' ' + (blogCreating ? styles.addMargin:'')}>
      <Head>
        <title>{searchQuery ? `${searchQuery} ` : 'Discover Top Software '}| Viasocket Discovery</title>
        <meta
          name="description"
          content={
            searchQuery
              ? `Search results for "${searchQuery}" on Viasocket Discovery. Explore top software in various categories curated by experts and users. ${
                  blogs.length > 0
                    ? `"${blogs.slice(0, 2).map(blog => blog.title).join('", ')}".`
                    : ''
                }`
              : 'Viasocket Discovery offers a platform to explore and discover top software in various categories. Curated by experts and users, it\'s your go-to place to find the best software solutions.'
          }
        />

      
      </Head>
      {!blogCreating && <div className={styles.homePageDiv}>
        {
          !isOpen && !searchQuery && !typingStart &&(

            <div className = {styles.homeTitleDiv}>
              <h1 className={styles.homeTitle}>Discover Top Software</h1>
              <p className={styles.homep}>{'Find top software from every category, thoughtfully curated by industry experts and individuals just like you.'}</p>
            </div>
          )
        }     
        { typingStart &&       
          <div className={styles.postHeaderDiv}>
              {isCategoryClicked && searchQuery && !isOpen ? (
                  renderBlogsSection(blogs, searchQuery, true)
              ) : (
                  <>
                      {!isCategoryClicked && renderCategories(searchCategories)}
                      {isCategoryClicked && renderBlogsSection(blogs)}
                  </>
              )}
          </div>
        }
        <div className={typingStart ? '' : styles.searchDiv}>
          <Search className={typingStart ? styles.showInBottom :  styles.showInCenter} searchQuery={searchQuery} setSearchQuery={handleSetSearchQuery} handleAskAi = {handleAskAi} placeholder = {(isCategoryClicked || !typingStart)  ? 'Search' : 'Search or pick a category' } messages={messages} disableEnter setTypingStart={setTypingStart} setIsCategoryClicked={setIsCategoryClicked}/>
          {
            !typingStart && 
            <>
              <div className = {styles.popularTagsDiv}>
                {popularTags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/?search=${tag}`}
                  className={`${blogstyle.tag} ${blogstyle[tag.toLowerCase()]}`}
                  onClick={()=>{
                    setIsCategoryClicked(true);
                  }}
                >
                  {tag}
                </Link>
              ))}
              </div>
              <h4 className={styles.popularUsers}>Top Contributors</h4>
              <div className = {styles.popularUsersDiv}>
                {popularUsers.map((user, index) => (
                  <Link target='_blank' key={index} href={`/user/${user.id}`} className={styles.userLink}>
                    <div className = {styles.userHeader}>
                    <PersonOutlineOutlinedIcon  className={userStyles.iconStyle}/>
                      <h5>{user.name.split(" ")[0].charAt(0).toUpperCase() + user.name.slice(1)}</h5>
                      <OpenInNewIcon className={styles.userLinkIcon}/>
                    </div>
                      <p>
                        {user?.meta?.bio
                          ? user.meta.bio.split(" ").slice(0, 50).join(" ") + (user.meta.bio.split(" ").length > 50 ? "..." : "")
                          : 'Viasocket User'}
                      </p>
                      <p className={userStyles.contribution}>
                        <b>
                        {user.createdBlogs > 0 ?
                          `${user.createdBlogs} blog${user.createdBlogs > 1 ? 's' : ''} `
                          : ''
                        } 
                        {(user.contributedBlogs > 0 && (user.createdBlogs)>0) 
                          ? `and `: ``
                        } 
                        {user.contributedBlogs > 0 ?
                          `${user.contributedBlogs} contribution${user.contributedBlogs > 1 ? 's' : ''} ` : ''
                        }
                        </b>
                      </p>
                  </Link>
                ))}
              </div>
            </>
          }
        </div>
        <Chatbot bridgeId = {process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE} messages={messages} setMessages = {setMessages} chatId = {chatId} homePage setIsOpen = {setIsOpen} isOpen = {isOpen} searchResults = {searchQuery ? blogs.filter(blog => !blog.dummy) : null}/>
      </div>}
      {blogCreating && 
      // blogCreating && 
        // <div className = {styles.createBlogLoaderContainer}>
        //   <h3>Hang on !!! We are working to get the best apps for you.</h3>
        //   <div class={styles.createBlogLoader}></div>
        // </div>
        // <EnhancedLoader />
        <div className = {styles.createBlogLoaderContainer}>

        <Loader />
        </div>
      }
      <UnauthorizedPopup isOpen={unAuthPopup} onClose={() => setUnAuthPopup(false)} />
			<UserBioPopup isOpen={userBioPopup} onClose={()=>setUserBioPopup(false)}/>
      <div ref={divRef}></div>
    </div>
  );
}
