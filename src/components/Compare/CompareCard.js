import Link from "next/link";
import styles from "./CompareCard.module.scss";

export default function CompareCard({ page, showAuthor = true }) {
  const showMeta =
    (showAuthor && page.authorName) || page.publishedLabel;
  return (
    <Link href={`/compare/${page.slug}`} className={styles.card}>
      {page.category ? <p className={styles.category}>{page.category}</p> : null}
      <h3 className={styles.title}>{page.title}</h3>
      {page.description ? (
        <p className={styles.description}>{page.description}</p>
      ) : null}
      {showMeta ? (
        <p className={styles.meta}>
          {showAuthor && page.authorName ? <span>{page.authorName}</span> : null}
          {showAuthor && page.authorName && page.publishedLabel ? (
            <span aria-hidden="true"> · </span>
          ) : null}
          {page.publishedLabel ? (
            <time dateTime={page.publishedAt}>{page.publishedLabel}</time>
          ) : null}
        </p>
      ) : null}
    </Link>
  );
}
