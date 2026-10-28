import Head from "next/head";
import Link from "next/link";
import CompareCard from "@/components/Compare/CompareCard";
import { discoveryUrl } from "@/lib/site";
import styles from "./CompareIndex.module.scss";

export default function CompareIndex({ pages = [] }) {
  const description =
    "Compare tools side by side. Browse the latest viaSocket Discovery comparisons.";
  return (
    <div className={styles.page}>
      <Head>
        <title>Compare tools side by side | viaSocket Discovery</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={discoveryUrl("/compare")} />
        <meta property="og:title" content="Compare tools side by side" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={discoveryUrl("/compare")} />
        <meta property="og:type" content="website" />
      </Head>
      <div className={styles.inner}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">Discovery</Link>
          <span aria-hidden="true">/</span>
          <span>Compare</span>
        </nav>
        <h1>Compare tools side by side</h1>
        <p className={styles.intro}>{description}</p>
        {pages.length ? (
          <div className={styles.list}>
            {pages.map((page) => (
              <CompareCard key={page.slug} page={page} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No comparisons yet.</p>
        )}
      </div>
    </div>
  );
}
