import MarqueeApps from "@/components/MarqueeApps/MarqueeApps";
import TopContributors from "@/components/TopContributors/TopContributors";
import Link from "next/link";
import blogstyle from "@/components/Blog/Blog.module.scss";

const PopularContent = ({ popularTags, popularUsers, setIsCategoryClicked }) => {
  return (
    <>
      <div className="ragini d-flex flex-wrap gap-2 w-75 px-3 mt-3">
        {popularTags.map((tag, index) => (
          <Link
            key={index}
            href={`/?search=${tag.label.replaceAll(" ", "+")}`}
            className={`${blogstyle.tag} ${blogstyle[tag.label.toLowerCase()]} d-inline-flex align-items-center gap-2 border px-3 py-2 text-decoration-none text-dark bg-white`}
            onClick={() => {
              setIsCategoryClicked(true);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="#a8200d"
              aria-hidden="true"
            >
              <path d={tag.iconPath} />
            </svg>
            {tag.label}
            <span className="text-muted">· {tag.count}</span>
          </Link>
        ))}
      </div>
      <MarqueeApps />
      <TopContributors popularUsers={popularUsers} />
    </>
  );
};

export default PopularContent;
