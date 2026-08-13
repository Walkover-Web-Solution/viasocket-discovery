import { useState, useEffect } from "react";
import styles from "@/pages/home.module.scss";
import { useUser } from "@/context/UserContext";
import { getAllPreviousMessages } from "@/utils/apis/chatbotapis";
import { getAllUsers, safeParse, nameToSlugName } from "@/utils/utils";
import { getPopularUsecaseContributors } from "@/services/usecaseServices";
import blogServices from "@/services/blogServices";
import { createUsecase } from "@/utils/apis/usecaseApis";
import { toast } from "react-toastify";
import UnauthorizedPopup from "@/components/UnauthorisedPopup/UnauthorisedPopup";
import Head from "next/head";
import { useRouter } from "next/router";
import Loader from "@/components/loader/Loader";
import HomePageContent from "@/components/HomePageContent/HomePageContent";

export async function getServerSideProps() {
  try {
    const env = process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT;

    const [popularBlogUsers, popularUsecaseUsers] = await Promise.all([
      blogServices.getPopularUsers(env),
      getPopularUsecaseContributors(env),
    ]);

    const countsByUser = {};
    (popularBlogUsers || []).forEach((u) => {
      countsByUser[u._id] = {
        ...(countsByUser[u._id] || {}),
        createdBlogs: u.createdBlogs || 0,
        contributedBlogs: u.contributedBlogs || 0,
      };
    });
    (popularUsecaseUsers || []).forEach((u) => {
      countsByUser[u._id] = {
        ...(countsByUser[u._id] || {}),
        createdUsecases: u.createdUsecases || 0,
        contributedUsecases: u.contributedUsecases || 0,
      };
    });

    const rankedUsers = Object.entries(countsByUser)
      .map(([id, counts]) => ({
        _id: parseInt(id),
        createdBlogs: counts.createdBlogs || 0,
        contributedBlogs: counts.contributedBlogs || 0,
        createdUsecases: counts.createdUsecases || 0,
        contributedUsecases: counts.contributedUsecases || 0,
      }))
      .sort(
        (a, b) =>
          b.createdBlogs + b.contributedBlogs + b.createdUsecases + b.contributedUsecases -
          (a.createdBlogs + a.contributedBlogs + a.createdUsecases + a.contributedUsecases),
      )
      .slice(0, 6);

    const userIds = rankedUsers.map((user) => user._id);

    const usersResult = await getAllUsers(userIds);

    let users = usersResult || [];

    const enrichedUsers = users
      .map(
        (user, index) =>
          user && {
            ...user,
            createdBlogs: rankedUsers[index]?.createdBlogs || 0,
            contributedBlogs: rankedUsers[index]?.contributedBlogs || 0,
            createdUsecases: rankedUsers[index]?.createdUsecases || 0,
            contributedUsecases: rankedUsers[index]?.contributedUsecases || 0,
          },
      )
      .filter(Boolean);

    return { props: { popularUsers: enrichedUsers } };
  } catch (error) {
    console.error("error on home page serverside props", error);
    return { props: { popularUsers: [] } };
  }
}

export default function Home({ popularUsers = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [blogCreating, setBlogCreating] = useState(false);
  const [usecaseCreating, setUsecaseCreating] = useState(false);
  const user = useUser().user;
  const chatId = user?.id || Math.random();
  const router = useRouter();
  const [unAuthPopup, setUnAuthPopup] = useState(false);



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
    if (!user) setIsOpen(false);
  }, [user]);

  async function handleCreateUsecase(apps, message) {
    if (!user) {
      setUnAuthPopup(true);
      return;
    }
    setUsecaseCreating(true);
    const appsPayload = apps.map((app) => ({ app: app.name, app_slug: app.appslugname }));
    const result = await createUsecase(appsPayload, message);
    if (!result?.usecaseId) {
      toast.error("We got some Error creating the usecase, Please try again");
      setUsecaseCreating(false);
    } else {
      // land on the canonical URL — the full "<app>-automation-ideas" heading slug —
      // falling back to the id only when the usecase has no app slug at all
      const appSlug = result.app_slug || (result.app ? nameToSlugName(result.app) : "");
      const slug = appSlug
        ? appSlug.endsWith("-automation-ideas")
          ? appSlug
          : `${appSlug}-automation-ideas`
        : result.usecaseId;
      router.push(`/usecase/${slug}`);
    }
  }

  return (
    <div
      className={
        styles.homePageContainer +
        " " +
        (blogCreating || usecaseCreating ? styles.addMargin : "")
      }
    >
      <Head>
        <title>Discover Top Software | Viasocket Discovery</title>
        <meta
          name="description"
          content="Viasocket Discovery offers a platform to explore and discover top software in various categories. Curated by experts and users, it's your go-to place to find the best software solutions."
        />
      </Head>
      <HomePageContent
        blogCreating={blogCreating}
        usecaseCreating={usecaseCreating}
        isOpen={isOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleCreateUsecase={handleCreateUsecase}

        messages={messages}
        setMessages={setMessages}
        chatId={chatId}
        setIsOpen={setIsOpen}
        popularUsers={popularUsers}
      />
      {(blogCreating || usecaseCreating) && (
        <div className={styles.createBlogLoaderContainer}>
          <Loader />
        </div>
      )}
      <UnauthorizedPopup
        isOpen={unAuthPopup}
        onClose={() => setUnAuthPopup(false)}
      />
    </div>
  );
}
