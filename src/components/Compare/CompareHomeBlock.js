import Link from "next/link";
import AccentBar from "@/components/AccentBar/AccentBar";
import CompareCard from "@/components/Compare/CompareCard";
import styles from "./CompareHomeBlock.module.scss";

export default function CompareHomeBlock({ pages = [] }) {
  if (!pages.length) return null;
  return (
    <div className="w-100 w-md-75 px-3 mt-4">
      <section className={styles.block} aria-labelledby="compare-home-heading">
        <div className={styles.header}>
          <h2 id="compare-home-heading" className={styles.heading}>
            <AccentBar />
            Compare tools side by side
          </h2>
          <Link href="/compare" className={styles.viewAll}>
            View all comparisons
          </Link>
        </div>
        <div className={styles.cards}>
          {pages.map((page) => (
            <CompareCard key={page.slug} page={page} />
          ))}
        </div>
      </section>
    </div>
  );
}
