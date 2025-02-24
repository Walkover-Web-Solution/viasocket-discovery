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
import Popup from '@/components/PopupModel/PopupModel';
import { toast } from 'react-toastify';
import { compareBlogs } from '@/utils/apis/chatbotapis';
import { publishBlog, updateBlog } from '@/utils/apis/blogApis';
import { useUser } from '@/context/UserContext';
import { dispatchAskAiEvent, formatDate, getAllUsers, nameToSlugName, restoreDotsInKeys, safeParse } from '@/utils/utils';
import BlogCard from '@/components/Blog/Blog';
import { getCurrentEnvironment, getFromLocalStorage } from '@/utils/storageHelper';
import Head from 'next/head';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box } from '@mui/system';
import Image from 'next/image';
import diamondImage from  "../../../static/images/diamond.svg";
import Link from 'next/link';
import { Accordion, AccordionDetails, AccordionSummary, Avatar   } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { deleteComment } from '@/utils/apis/commentApis';
import { formatDistanceToNow } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';


export async function getServerSideProps(context) {
  const { blogId } = context.params;
  const props = {};
  try {
    const blog = await blogServices.getBlogById(blogId[0],getCurrentEnvironment());
    if (!blog) {
      return {
        notFound : true
      }
    }
    const relatedBlogsPromise = blogServices.searchBlogsByTags(blog.tags, blogId[0], blog?.meta?.category, getCurrentEnvironment());
    const appKeys = Object.keys(blog.apps);
    const appBlogsPromise = blogServices.searchBlogsByApps(appKeys, blogId[0], getCurrentEnvironment());
    const usersSet = new Set(blog.createdBy);
    Object.values(blog.comments || {}).forEach(comment => usersSet.add(comment.createdBy));
    const usersPromise = getAllUsers(Array.from(usersSet));
    const [relatedBlogs, appBlogs, users] = await Promise.all([relatedBlogsPromise, appBlogsPromise, usersPromise]);
    const filteredUsers = users.filter(user => user !== null);
    props.faq = blog.blog.find((section)=> section?.section=== 'FAQ')?.content || [];
    props.blog = blog;
    props.users = filteredUsers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    props.relatedBlogs = relatedBlogs;
    props.appBlogs = appBlogs[0];
  } catch (error) {
    console.error('Error fetching blog data:', error); // Return an empty object if there's an error
  }
  return { props };
}

export default function BlogPage({ blog, users, relatedBlogs, appBlogs,faq}) {
  const [blogData, setBlogData] = useState(blog);
  const [integrations, setIntegrations] = useState(null);
  const router= useRouter();
  const [searchQuery, setSearchQuery] = useState(getFromLocalStorage('query' ,true) || '');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const currentUser = useUser().user;
  const [FAQs, setFAQs] = useState(faq || []);
  const [comments, setComments] = useState(blogData?.comments || {});
  const {user} = useUser();
  if(user){
    users[user.id] = user;
  }
  const createdBy = blogData?.createdBy.map(userId => users[userId]).filter(user => user);
  const blogDataToSend = { 
    title: blogData?.title,
    tags: blogData?.tags, 
    blog: blogData?.blog, 
    meta: blogData?.meta
  };
  const handleAskAi = async () => {
    setIsOpen(true);
    dispatchAskAiEvent(searchQuery);
    setSearchQuery('');
  }

 useEffect(()=>{
  setFAQs(blogData?.blog?.find(blog => blog?.section === 'FAQ')?.content);
 },[blogData])

//  useEffect(() => {
//   if(blogData?.imageUrl) document.documentElement.style.setProperty("--blogTitleBackground", `url(${blogData.imageUrl})`);   
// }, [blogData?.imageUrl]); 


  useEffect(() => {
    if (blog) {
      router.replace(
        {
          pathname: `/blog/${blog.id}/${nameToSlugName(blog?.meta?.category || '')}/${nameToSlugName(blog.slugName)}`,
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
    if (blogData?.apps) {
      blogData.apps = restoreDotsInKeys(blogData.apps);
      const appKeys = Object.keys(blogData.apps);
      getData(appKeys)
    }
  }, []);

  useEffect(() => {
    if(!currentUser?.id) return ;
    (async () => {
      const indexes = [];
      const chatHistoryData = await getAllPreviousMessages(`${blog?.id}${currentUser?.id}`, process.env.NEXT_PUBLIC_COMMENT_BRIDGE);
      let prevMessages = chatHistoryData.data
      .filter((chat) => chat.role === "user" || chat.role === "assistant")
      .map((chat,index) => {
        if(chat['raw_data.variables']?.retry) indexes.push(index);
        return({
        role: chat.role,
        content:
          chat.role === "user" ? chat.content : safeParse(chat.content,process.env.NEXT_PUBLIC_COMMENT_BRIDGE,`${blog.id}${currentUser?.id}`),
      })});
      for (let i = indexes.length-1; i >=0 ; i--) {
        const currentIndex = indexes[i];
        prevMessages.splice(currentIndex , 1);
        prevMessages.splice(currentIndex-1 , 1);
      }
      setMessages(prevMessages);
    })();
  }, [currentUser?.id]);

  useEffect(()=>{
    if(!currentUser) {
      setIsOpen(false);
    }
  },[currentUser])

  const handleDeleteComment = async(commentId) => {
    const deleted = await deleteComment(commentId, blogData.id);
    
    if(deleted){
      setComments((comments) => {
        const updatedComments = { ...comments };
        delete updatedComments[commentId];
        return updatedComments;
      });
    }
  };

  const jsonLd = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    "headline": blogData.title,
    "author": Object.values(users).map(user => ({
      "@type": "Person",
      "name": user?.name,
      "url": `https://viasocket.com/discovery/user/${user?.id}`,
    })),
    "datePublished": blogData.createdAt,
    "dateModified": blogData.updatedAt ,
    "mainEntityOfPage": `https://viasocket.com/discovery/blog/${blogData?.id}`,
    "publisher": {
      "@type": "Organization",
      "name": "Viasocket",
      "logo": {
        "@type": "ImageObject",
        "url": "https://viasocket.com/assets/brand/logo.svg"
      }
    },
    "description": blogData?.meta?.SEOMetaDescription || blogData?.title,
    "keywords": [...blogData?.tags || [], ...(blogData?.meta?.SEOKeywords || [])].join(', ').slice(0, -2),
    "url": `https://viasocket.com/discovery/blog/${blogData?.id}`,
    "contactPoint":{
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://viasocket.com/support"
    }
  };
  
  return (
    <>
      <Head>
        <meta name="description" content={blog?.meta?.SEOMetaDescription || blog?.title}/>
        <meta name="author" content={users?.[blog?.createdBy[0]]?.name}/>
        <meta name="keywords" content={[...blog?.tags||[], ...(blog?.meta?.SEOKeywords || [])].join(', ')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div>
        <div className={`${styles.container} ${isOpen ? styles.containerOpen : ''}`}>
          <AIresponse blogData={blogData} users={createdBy} integrations={integrations} appBlogs={appBlogs} isOpen={isOpen} setIsOpen={setIsOpen} setComments = {setComments} />
          <Box className={styles.searchDiv}>
            <h2>Dive Deeper with AI</h2>
            <p>Want to explore more? Follow up with AI for personalized insights and automated recommendations based on this blog</p>
            <Image src={diamondImage} alt="diamond" className={styles.diamondImageSmall} />
            <Image src={diamondImage} alt="diamond" className={styles.diamondImageLarge} />
            {!isOpen && <Search className={styles.searchBox} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleAskAi={handleAskAi} placeholder='Follow up if any query with AI...' />}
          </Box>
          <div className={styles.tagsContainer}>
            <h3>Related Tags</h3>
            <div className={styles.tagsDiv}>
              {blogData?.tags?.map((tag, index) => (
                <Link
                href={`/?search=%23${tag}`}
                target='_blank'
                key={index}
                className={styles.tag}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          {comments && Object.keys(comments).length > 0 && (
            <div className={styles.commentContainer}>
              <h2 className={styles.responses}>Contributors</h2>
              {Object.entries(comments || {}).map(([commentId, comment]) => (
                <div key={commentId} className={styles.comment}>
                  <div className = {styles.commentHeader}>
                    <div className = {styles.userDetails}>
                      <Link href={`/user/${comment.createdBy}`} target='_blank'>
                        {users[comment.createdBy]?.name?.charAt(0).toUpperCase()+ users[comment.createdBy]?.name?.slice(1)},
                      </Link>
                      <span className = {styles.commentDate}>{formatDate(new Date(comment.createdAt))}</span>
                    </div>
                    {comment.createdBy == currentUser?.id && (
                      <button
                        onClick={() => handleDeleteComment(commentId)}
                        className={styles.deleteButton}
                      >
                        <DeleteIcon/>
                      </button>
                    )}
                  </div>
                  <div>
                    <p className = {styles.commentText}>{comment.text}</p>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
          {
            relatedBlogs?.length > 0 && (
              <div className={styles.relatedBlogsDiv}>
                <h3>Related Blogs</h3>
                {relatedBlogs.map((blog) => {
                  return <a target='_blank' href = {`/discovery/blog/${blog.id}/${blog.slugName}}`} className = {styles.blogOnSearch} key = {blog.id}><h4>{blog.title} <ArrowForwardIosIcon className={styles.arrowIcon} sx={{fontSize: '15px'}}/></h4></a>
                  return <BlogCard key={blog.id} blog={blog} className={styles.blogOnSearch} />
                })}
              </div>
            )
          }
         {FAQs?.length > 0 &&
            <div className={styles.FAQContainer} >
              <h2>Frequently Asked Questions</h2>
              { FAQs?.map((faq, index) => (
                <Accordion className={styles.FAQaccordian} key={index}  >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}a-content`}
                    id={`panel${index + 1}a-header`}
                    sx= {{ boxShadow:"none" }}
                  >
                    <p>{faq.question}</p>
                  </AccordionSummary>
                  <AccordionDetails className={styles.FAQaccordianDetail} >
                    <p>{faq.answer}</p>
                  </AccordionDetails>
                 </Accordion>
              ))
            }
            </div>
          }

          {/* {isOpen && <button onClick={handlePublish} className={styles.publishButton}>Publish Changes</button>} */}
        </div>
        <Chatbot bridgeId={process.env.NEXT_PUBLIC_COMMENT_BRIDGE} messages={messages} setMessages={setMessages} chatId={`${blog?.id}${currentUser?.id}`} setBlogData={setBlogData} variables={{ blogData: blogDataToSend }} setIsOpen={setIsOpen} isOpen={isOpen} blogId={blog?.id}  users={createdBy} setComments={setComments}/>
        {/* <Popup isOpen={isPopupOpen} onClose={() => setIsPopUpOpen(false)} handlePublish={handleNewPublish} /> */}
      </div>
    </>
  );
}






















  // const [oldBlog,setOldBlog]=useState('');
  // const [isPopupOpen, setIsPopUpOpen] = useState(false);
  // const handlePublish = async () => {
  //   const blogDataToPublish = {
  //     ...blogData,
  //     published: true,
  //   }
  //   try {
  //     const res = await compareBlogs(
  //       {
  //         variables : {
  //           current_blog: (oldBlog?.blog),
  //           updated_blog: (blogData?.blog),
  //         }
  //       })
  //     if (!oldBlog || JSON.parse(res?.content)?.ans === 'yes'){
  //       await updateBlog(blog.id, blogDataToPublish);
  //       setOldBlog(blogData);
  //       toast.success('Blog updated successfully!');
  //     } else {
  //       setIsPopUpOpen(true);
  //     }
  //   } catch (error) {
  //     console.error('Failed to publish blog:', error);
  //     toast.error('An error occurred while publishing the blog: ' + error.message);
  //   }
  // };
  // const handleNewPublish = async () => {
  //   const blogDataToPublish = {
  //     ...blogData,
  //     published: true
  //   };
  //   try {
  //     const data = await publishBlog(blogDataToPublish);
  //     setOldBlog(blogData);
  //     router.push(`/blog/${data.id}`);
  //     toast.success('Blog published successfully!');
  //   } catch (error) {
  //     console.error('Failed to publish blog:', error);
  //     toast.error('An error occurred while publishing the blog: ' + error.message);
  //   } finally {
  //     setIsPopUpOpen(false)
  //   }
  // };