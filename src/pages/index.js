import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import styles from "@/pages/home.module.scss";
import { useUser } from "@/context/UserContext";
import { getAllPreviousMessages } from "@/utils/apis/chatbotapis";
import {
  dispatchAskAiEvent,
  dispatchAskAppAiWithAuth,
  getAllUsers,
  safeParse,
} from "@/utils/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import blogstyle from "@/components/Blog/Blog.module.scss";
import { titleSuggestions } from "@/utils/apiHelper";
import { createBlog, fetchBlogs } from "@/utils/apis/blogApis";
import blogServices from "@/services/blogServices";
import { toast } from "react-toastify";
import UnauthorizedPopup from "@/components/UnauthorisedPopup/UnauthorisedPopup";
import UserBioPopup from "@/components/UserBioPopup/UserBioPoup";
import Head from "next/head";
import { getCategoriesFromDbDash } from "./api/tags";
import Loader from "@/components/loader/Loader";
import HomePageContent from "@/components/HomePageContent/HomePageContent";

export async function getServerSideProps() {
  try {
    const env = process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT;

    const popularUsers = (await blogServices.getPopularUsers(env)) || [];

    const userIds = popularUsers.map((user) => user._id);

    const [usersResult, categoriesResult] = await Promise.allSettled([
      getAllUsers(userIds),
      getCategoriesFromDbDash(),
    ]);

    let users = usersResult.status === "fulfilled" ? usersResult.value : [];
    const categories =
      categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
    if (categoriesResult.status != "fulfilled")
      console.error("error getting categories", categoriesResult.reason);

    const enrichedUsers = users
      .map(
        (user, index) =>
          user && {
            ...user,
            createdBlogs: popularUsers[index]?.createdBlogs || 0,
            contributedBlogs: popularUsers[index]?.contributedBlogs || 0,
          },
      )
      .filter(Boolean);

    return { props: { popularUsers: enrichedUsers, categories } };
  } catch (error) {
    console.error("error on home page serverside props", error);
    return { props: { popularUsers: [], categories: [] } };
  }
}

export default function Home({ popularUsers = [], categories = [] }) {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryClicked, setIsCategoryClicked] = useState("not known");
  const [isLoading, setIsLoading] = useState(true);
  const [blogCreating, setBlogCreating] = useState(false);
  const [tags, setTags] = useState([]);
  const user = useUser().user;
  const chatId = user?.id || Math.random();
  const router = useRouter();
  const [typingStart, setTypingStart] = useState(false);
  const popularTags = [
    {
      label: "Customer Relationship Management",
      count: 47,
      iconPath:
        "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    },
    {
      label: "Project Management",
      count: 32,
      iconPath: "M3 5h4v14H3zm6 0h4v9H9zm6 0h4v6h-4z",
    },
    {
      label: "Database Management",
      count: 18,
      iconPath:
        "M12 3C7 3 3 4.79 3 7v10c0 2.21 4 4 9 4s9-1.79 9-4V7c0-2.21-4-4-9-4zm0 2c4.41 0 7 1.5 7 2s-2.59 2-7 2-7-1.5-7-2 2.59-2 7-2zm0 14c-4.41 0-7-1.5-7-2v-2.41c1.62.93 4.21 1.41 7 1.41s5.38-.48 7-1.41V17c0 .5-2.59 2-7 2zm0-4c-4.41 0-7-1.5-7-2v-2.41c1.62.93 4.21 1.41 7 1.41s5.38-.48 7-1.41V13c0 .5-2.59 2-7 2z",
    },
    {
      label: "Sales and Marketing",
      count: 64,
      iconPath: "M3.5 18.5 9 13l4 4 7.5-7.5L22 11l-9 9-4-4-5 5z",
    },
    {
      label: "Human Resource",
      count: 23,
      iconPath:
        "M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z",
    },
    {
      label: "Finance Hub",
      count: 29,
      iconPath:
        "M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.38-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z",
    },
  ];
  const divRef = useRef(null);
  const [unAuthPopup, setUnAuthPopup] = useState(false);
  const [userBioPopup, setUserBioPopup] = useState(false);
  const [searchCategories, setSearchCategories] = useState(categories);
  const [allcategories, setAllcategories] = useState(categories);

  useEffect(() => {
    if (
      !router.isReady ||
      (isOpen && !searchQuery.length > 0 && !isCategoryClicked)
    )
      return;
    const fetchAllBlogs = async () => {
      setSearchQuery(router.query?.search || "");
      setBlogs([]);
      setIsLoading(true);
      try {
        const data = await fetchBlogs(
          router.query?.search ? `?search=${router.query?.search}` : "",
        );
        if (data.tags) setTags(data.tags);
        setBlogs(data?.blogs);
        if (data?.blogs?.length < 10) {
          setIsLoading(true);
          const titles = await titleSuggestions(
            router.query?.search,
            data.blogs.map((blog) => blog.title),
          );
          setBlogs((prevBlogs) => [
            ...prevBlogs,
            ...titles.map((ele) => ({ dummy: true, title: ele })),
          ]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBlogs();
  }, [router.query?.search, router.isReady]);

  const fetchSearchBlogs = useCallback(async () => {
    if (searchQuery !== "")
      router.replace({ query: { search: searchQuery } }, undefined, {
        shallow: true,
      });
    else router.replace("/", undefined, { shallow: true });
  }, [searchQuery]);

  const debouncedFetchBlogs = useCallback(debounce(fetchSearchBlogs, 400), [
    fetchSearchBlogs,
  ]);

  function handleSetSearchQuery(query) {
    setSearchQuery(query);
  }

  useEffect(() => {
    if (!typingStart && searchQuery?.length) setTypingStart(true);
    setIsLoading(true);
    setBlogs([]);
    debouncedFetchBlogs();
    return () => {
      debouncedFetchBlogs.cancel();
    };
  }, [searchQuery, isOpen]);

  useEffect(() => {
    let filteredCategories = allcategories.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );
    setSearchCategories(filteredCategories);
    if (filteredCategories.length == 0) setIsCategoryClicked(true);
    if (isCategoryClicked == "not known") setIsCategoryClicked(false);
    if (searchQuery.length == 0) {
      setIsCategoryClicked(false);
      setSearchCategories(allcategories);
    }
  }, [searchQuery, isCategoryClicked]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const indexes = [];
      const chatHistoryData = await getAllPreviousMessages(
        chatId,
        process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE,
      ).catch((err) => null);
      let prevMessages = chatHistoryData?.data
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
                    process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE,
                    chatId,
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
  }, [user]);

  useEffect(() => {
    if (typingStart) divRef.current.scrollIntoView();
  }, [blogs]);

  // Conditional blog rendering

  const tagsContainer = () => {
    if (!tags?.length || !searchQuery || isLoading) return null;
    return (
      <div className={`${styles.searchTags} mb-3`}>
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
    );
  };
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
      ),
    );
  };

  const handleAskAi = async (prompt) => {
    if (prompt) {
      dispatchAskAppAiWithAuth(prompt);
    } else {
      dispatchAskAiEvent(searchQuery);
    }
    setIsOpen(true);
  };

  async function handleCreateBlog(title) {
    if (!user) {
      setUnAuthPopup(true);
      return;
    }
    if (!user?.meta?.bio) {
      setUserBioPopup(true);
      return;
    }
    setBlogCreating(true);
    const blogId = await createBlog(title);
    if (!blogId) {
      toast.error("We got some Error creating the blog, Please try again");
      setBlogCreating(false);
    } else {
      router.push(`/blog/${blogId}`);
    }
  }

  useEffect(() => {
    if (!user) setIsOpen(false);
  }, [user]);

  return (
    <div
      className={
        styles.homePageContainer +
        " " +
        (searchQuery ? styles.contentToBottom : "") +
        " " +
        (blogCreating ? styles.addMargin : "")
      }
    >
      <Head>
        <title>
          {searchQuery ? `${searchQuery} ` : "Discover Top Software"}| Viasocket
          Discovery
        </title>
        <meta
          name="description"
          content={
            searchQuery
              ? `Search results for "${searchQuery}" on Viasocket Discovery. Explore top software in various categories curated by experts and users. ${
                  blogs.length > 0
                    ? `"${blogs
                        .slice(0, 2)
                        .map((blog) => blog.title)
                        .join('", ')}".`
                    : ""
                }`
              : "Viasocket Discovery offers a platform to explore and discover top software in various categories. Curated by experts and users, it's your go-to place to find the best software solutions."
          }
        />
      </Head>
      <HomePageContent
        blogCreating={blogCreating}
        isOpen={isOpen}
        searchQuery={searchQuery}
        typingStart={typingStart}
        blogs={blogs}
        searchCategories={searchCategories}
        isLoading={isLoading}
        isCategoryClicked={isCategoryClicked}
        setSearchQuery={handleSetSearchQuery}
        setIsCategoryClicked={setIsCategoryClicked}
        handleCreateBlog={handleCreateBlog}
        handleAskAi={handleAskAi}
        messages={messages}
        setMessages={setMessages}
        chatId={chatId}
        setTypingStart={setTypingStart}
        setIsOpen={setIsOpen}
        popularTags={popularTags}
        popularUsers={popularUsers}
        tagsContainer={tagsContainer}
        highlightText={highlightText}
      />
      {blogCreating && (
        <div className={styles.createBlogLoaderContainer}>
          <Loader />
        </div>
      )}
      <UnauthorizedPopup
        isOpen={unAuthPopup}
        onClose={() => setUnAuthPopup(false)}
      />
      <UserBioPopup
        isOpen={userBioPopup}
        onClose={() => setUserBioPopup(false)}
      />
      <div ref={divRef}></div>
    </div>
  );
}
