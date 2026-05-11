import AIresponse from "@/components/AIresponse/AIresponse";
import blogServices from "@/services/blogServices";
import { fetchIntegrations } from "@/utils/apiHelper";
import styles from "./blogPage.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Chatbot from "@/components/ChatBot/ChatBot";
import { getAllPreviousMessages } from "@/utils/apis/chatbotapis";
import { useUser } from "@/context/UserContext";
import {
  dispatchAskAiEvent,
  formatDate,
  getAllUsers,
  nameToSlugName,
  restoreDotsInKeys,
  safeParse,
} from "@/utils/utils";
import {
  getCurrentEnvironment,
  getFromLocalStorage,
} from "@/utils/storageHelper";
import Head from "next/head";
import Link from "next/link";
import { deleteComment } from "@/utils/apis/commentApis";
import DeleteIcon from "@mui/icons-material/Delete";
import FAQ from "@/components/FAQ/FAQ";
import BackToDashboardButton from "@/components/BackToDashboardButton/BackToDashboardButton";
import AiSearchBanner from "@/components/AiSearchBanner/AiSearchBanner";
import RelatedTags from "@/components/RelatedTags/RelatedTags";
import RelatedBlogs from "@/components/RelatedBlogs/RelatedBlogs";

export async function getServerSideProps(context) {
  const { blogId } = context.params;
  const props = {};
  try {
    const blog = await blogServices.getBlogById(
      blogId[0],
      getCurrentEnvironment(),
    );
    if (!blog) {
      return {
        notFound: true,
      };
    }
    const relatedBlogsPromise = blogServices.searchBlogsByTags(
      blog.tags,
      blogId[0],
      blog?.meta?.category,
      getCurrentEnvironment(),
    );
    const appKeys = Object.keys(blog.apps);
    const appBlogsPromise = blogServices.searchBlogsByApps(
      appKeys,
      blogId[0],
      getCurrentEnvironment(),
    );
    const usersSet = new Set(blog.createdBy);
    Object.values(blog.comments || {}).forEach((comment) =>
      usersSet.add(comment.createdBy),
    );
    const usersPromise = getAllUsers(Array.from(usersSet));
    const [relatedBlogs, appBlogs, users] = await Promise.all([
      relatedBlogsPromise,
      appBlogsPromise,
      usersPromise,
    ]);
    const filteredUsers = users.filter((user) => user !== null);
    props.faq =
      blog.blog.find((section) => section?.section === "FAQ")?.content || [];
    props.blog = blog;
    props.users = filteredUsers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    props.relatedBlogs = relatedBlogs;
    props.appBlogs = appBlogs[0];
  } catch (error) {
    console.error("Error fetching blog data:", error); // Return an empty object if there's an error
  }
  return { props };
}

export default function BlogPage({ blog, users, relatedBlogs, appBlogs, faq }) {
  const [blogData, setBlogData] = useState(blog);
  const [integrations, setIntegrations] = useState(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    getFromLocalStorage("query", true) || "",
  );
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const currentUser = useUser().user;
  const [FAQs, setFAQs] = useState(faq || []);
  const [comments, setComments] = useState(blogData?.comments || {});
  const { user } = useUser();
  if (user) {
    users[user.id] = user;
  }
  const createdBy = blogData?.createdBy
    .map((userId) => users[userId])
    .filter((user) => user);
  const blogDataToSend = {
    title: blogData?.title,
    tags: blogData?.tags,
    blog: blogData?.blog,
    meta: blogData?.meta,
  };
  const handleAskAi = async () => {
    setIsOpen(true);
    dispatchAskAiEvent(searchQuery);
    setSearchQuery("");
  };

  useEffect(() => {
    setFAQs(blogData?.blog?.find((blog) => blog?.section === "FAQ")?.content);
  }, [blogData]);

  //  useEffect(() => {
  //   if(blogData?.imageUrl) document.documentElement.style.setProperty("--blogTitleBackground", `url(${blogData.imageUrl})`);
  // }, [blogData?.imageUrl]);

  useEffect(() => {
    if (blog) {
      router.replace(
        {
          pathname: `/blog/${blog.id}/${nameToSlugName(blog?.meta?.category || "")}/${nameToSlugName(blog.slugName)}`,
        },
        undefined,
        { shallow: true }, // Keeps the page from reloading
      );
    }
  }, [blog?.id]);

  useEffect(() => {
    const getData = async (apps) => {
      const data = await fetchIntegrations(apps);
      setIntegrations(data);
    };
    if (blogData?.apps) {
      blogData.apps = restoreDotsInKeys(blogData.apps);
      const appKeys = Object.keys(blogData.apps);
      getData(appKeys);
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;
    (async () => {
      const indexes = [];
      const chatHistoryData = await getAllPreviousMessages(
        `${blog?.id}${currentUser?.id}`,
        process.env.NEXT_PUBLIC_COMMENT_BRIDGE,
      );
      let prevMessages = chatHistoryData.data
        .filter((chat) => chat.role === "user" || chat.role === "assistant")
        .map((chat, index) => {
          if (chat["raw_data.variables"]?.retry) indexes.push(index);
          return {
            role: chat.role,
            content:
              chat.role === "user"
                ? chat.content
                : safeParse(
                    chat.content,
                    process.env.NEXT_PUBLIC_COMMENT_BRIDGE,
                    `${blog.id}${currentUser?.id}`,
                  ),
          };
        });
      for (let i = indexes.length - 1; i >= 0; i--) {
        const currentIndex = indexes[i];
        prevMessages.splice(currentIndex, 1);
        prevMessages.splice(currentIndex - 1, 1);
      }
      setMessages(prevMessages);
    })();
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser) {
      setIsOpen(false);
    }
  }, [currentUser]);

  const handleDeleteComment = async (commentId) => {
    const deleted = await deleteComment(commentId, blogData.id);

    if (deleted) {
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
    headline: blogData.title,
    author: Object.values(users).map((user) => ({
      "@type": "Person",
      name: user?.name,
      url: `https://viasocket.com/discovery/user/${user?.id}`,
    })),
    datePublished: blogData.createdAt,
    dateModified: blogData.updatedAt,
    mainEntityOfPage: `https://viasocket.com/discovery/blog/${blogData?.id}`,
    publisher: {
      "@type": "Organization",
      name: "Viasocket",
      logo: {
        "@type": "ImageObject",
        url: "https://viasocket.com/assets/brand/logo.svg",
      },
    },
    description: blogData?.meta?.SEOMetaDescription || blogData?.title,
    keywords: [
      ...(blogData?.tags || []),
      ...(blogData?.meta?.SEOKeywords || []),
    ]
      .join(", ")
      .slice(0, -2),
    url: `https://viasocket.com/discovery/blog/${blogData?.id}`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://viasocket.com/support",
    },
  };

  return (
    <>
      <Head>
        <meta
          name="description"
          content={blog?.meta?.SEOMetaDescription || blog?.title}
        />
        <meta name="author" content={users?.[blog?.createdBy[0]]?.name} />
        <meta
          name="keywords"
          content={[
            ...(blog?.tags || []),
            ...(blog?.meta?.SEOKeywords || []),
          ].join(", ")}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div>
        <div
          className={`${styles.container} ${isOpen ? styles.containerOpen : ""}`}
        >
          <BackToDashboardButton className="btn mt-4 mb-3 d-block me-auto ms-3" />
          <AIresponse
            blogData={blogData}
            users={createdBy}
            integrations={integrations}
            appBlogs={appBlogs}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setComments={setComments}
          />
          <RelatedTags tags={blogData?.tags} />

          <AiSearchBanner
            isOpen={isOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleAskAi={handleAskAi}
          />

          {comments && Object.keys(comments).length > 0 && (
            <div className={styles.commentContainer}>
              <h2 className={styles.responses}>Contributors</h2>
              {Object.entries(comments || {}).map(([commentId, comment]) => (
                <div key={commentId} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <div className={styles.userDetails}>
                      <Link href={`/user/${comment.createdBy}`} target="_blank">
                        {users[comment.createdBy]?.name
                          ?.charAt(0)
                          .toUpperCase() +
                          users[comment.createdBy]?.name?.slice(1)}
                        ,
                      </Link>
                      <span className={styles.commentDate}>
                        {formatDate(new Date(comment.createdAt))}
                      </span>
                    </div>
                    {comment.createdBy == currentUser?.id && (
                      <button
                        onClick={() => handleDeleteComment(commentId)}
                        className={styles.deleteButton}
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                  <div>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <RelatedBlogs relatedBlogs={relatedBlogs} />
          <FAQ FAQs={FAQs} />

          {/* {isOpen && <button onClick={handlePublish} className={styles.publishButton}>Publish Changes</button>} */}
        </div>
        <Chatbot
          bridgeId={process.env.NEXT_PUBLIC_COMMENT_BRIDGE}
          messages={messages}
          setMessages={setMessages}
          chatId={`${blog?.id}${currentUser?.id}`}
          setBlogData={setBlogData}
          variables={{ blogData: blogDataToSend }}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          blogId={blog?.id}
          users={createdBy}
          setComments={setComments}
        />
      </div>
    </>
  );
}
