import AccentBar from "@/components/AccentBar/AccentBar";
import CompareCard from "@/components/Compare/CompareCard";
import styles from "./AuthorComparisons.module.scss";

export default function AuthorComparisons({ pages = [], authorName = "" }) {
  if (!pages.length) return null;
  const first = authorName.trim().split(" ")[0];
  const title = first ? `Comparisons by ${first}` : "Comparisons";
  return (
    <section className={styles.section} aria-labelledby="author-comparisons">
      <h2
        id="author-comparisons"
        className="h4 fw-bold d-flex align-items-center gap-2 mb-4"
        style={{ fontFamily: "var(--title-font)" }}
      >
        <AccentBar />
        {title}
      </h2>
      <div className={styles.list}>
        {pages.map((page) => (
          <CompareCard key={page.slug} page={page} showAuthor={false} />
        ))}
      </div>
    </section>
  );
}
