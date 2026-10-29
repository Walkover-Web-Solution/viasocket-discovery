import Head from "next/head";
import CompareArticle from "@/components/Compare/CompareArticle";
import { discoveryUrl } from "@/lib/site";

export default function CompareArticlePage({ page }) {
  const llmUrl = discoveryUrl(`/compare/${encodeURIComponent(page.slug)}/llm.txt`);
  return (
    <>
      <Head>
        <title>{`${page.title} | viaSocket Discovery`}</title>
        <meta name="description" content={page.description} />
        {page.authorName ? <meta name="author" content={page.authorName} /> : null}
        <link rel="canonical" href={page.canonical} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={page.canonical} />
        <meta property="og:type" content="article" />
        <link rel="alternate" type="text/plain" href={llmUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.jsonLd }}
        />
      </Head>
      <CompareArticle page={page} />
    </>
  );
}

export async function getStaticPaths() {
  const { getCompareSummaries } = await import("@/lib/compareContent");
  return {
    paths: getCompareSummaries().map((page) => ({ params: { slug: page.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { getComparePage } = await import("@/lib/compareContent");
  const page = getComparePage(params.slug);
  if (!page) return { notFound: true };
  return { props: { page } };
}
