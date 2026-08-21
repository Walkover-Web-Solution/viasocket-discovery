import { getUserById } from "@/services/proxyServices";
import { useEffect, useState } from "react";
import { fetchBlogs } from "@/utils/apis/blogApis";
import { fetchUsecasesByUser } from "@/utils/apis/usecaseApis";
import { useRouter } from "next/router";
import { nameToSlugName } from "@/utils/utils";
import UserProfileHeader from "@/components/UserProfileHeader/UserProfileHeader";
import UserBlogList from "@/components/UserBlogList/UserBlogList";
import BackToDashboardButton from "@/components/BackToDashboardButton/BackToDashboardButton";
import { useUser } from "@/context/UserContext";

// a usecase can be built from more than one app, so the card heading names all
// of them: "Slack", "Slack and Notion", "Slack, Notion and Trello"
function formatAppNames(apps) {
  const names = (apps || []).map((entry) => entry?.app).filter(Boolean);
  if (!names.length) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export async function getServerSideProps(context) {
  const { userId } = context.params;
  const user = await getUserById(userId);

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: { user },
  };
}

export default function UserPage({ user }) {
  const router = useRouter();
  const [usecases, setUsecases] = useState([]);
  const [usecasesLoading, setUsecasesLoading] = useState(true);
  const [count, setCount] = useState({});
  const currentUser = useUser().user;

  useEffect(() => {
    if (user) {
      router.replace(
        {
          pathname: `/user/${user.id}/${nameToSlugName(user.name)}`,
        },
        undefined,
        { shallow: true } // Keeps the page from reloading
      );
    }
  }, [user?.id]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBlogs(`?userId=${user.id}`);
      setCount(() => {
        let c = 0;
        data.blogs.forEach((blog) => {
          if (blog?.createdBy[0] === user.id) c++;
        });
        return {
          createdCount: c,
          contributed: data.blogs.length - c
        }
      });
    }
    fetchData();
  }, [user.id]);

  useEffect(() => {
    const fetchUsecaseData = async () => {
      const data = await fetchUsecasesByUser(user.id);
      setUsecases(data);
      const createdUsecases = data.filter((u) => u.createdBy === parseInt(user.id)).length;
      setCount((prev) => ({
        ...prev,
        createdUsecases,
        contributedUsecases: data.length - createdUsecases,
      }));
      setUsecasesLoading(false);
    };
    fetchUsecaseData();
  }, [user.id]);

  const usecaseCards = usecases.map((usecase) => ({
    id: usecase._id,
    app_slug: usecase.app_slug,
    app: usecase.app,
    title: (() => {
      const appNames = formatAppNames(usecase.apps) || usecase.app;
      return appNames ? `${appNames} automation ideas` : "Automation ideas";
    })(),
    apps: Object.fromEntries(
      (usecase.apps || []).map((entry) => [entry.app, { iconUrl: entry.iconUrl }]),
    ),
    tags: [],
  }));

  return (
    <div
      className="container-lg px-4"
      style={{ maxWidth: "60rem" }}
    >
      <BackToDashboardButton />
      <UserProfileHeader user={user} currentUser={currentUser} count={count} />
      <div className="mt-4">
        <UserBlogList
          blogs={usecaseCards}
          title={`Automation ideas by ${user.name.trim().split(" ")[0]}`}
          isLoading={usecasesLoading}
          userName={user.name}
         linkBuilder={(item) => `/automation-ideas/usecase/${item.app_slug ? `${item.app_slug}-automation-ideas` : nameToSlugName(item.app ? `${item.app} automation ideas` : item.title)}`}
        />
      </div>
    </div>
  );
}
