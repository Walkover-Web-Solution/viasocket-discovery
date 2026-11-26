import Head from "next/head";
import CompareArticle from "@/components/Compare/CompareArticle";
import { discoveryUrl } from "@/lib/site";

export default function CompareArticlePage({ page }) {
  const encoded = encodeURIComponent(page.slug);
  const llmUrl = discoveryUrl(`/compare/${encoded}/llm.txt`);
  const dataUrl = discoveryUrl(`/compare/${encoded}/data.json`);
  return (
    <>
      <Head>
        <title>{`${page.title} | viaSocket Discovery`}</title>
        <meta name="description" content={page.description} />
        {page.authorName ? <meta name="author" content={page.authorName} /> : null}
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large"
        />
        <link rel="canonical" href={page.canonical} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={page.canonical} />
        <meta property="og:type" content="article" />
        <link rel="alternate" type="text/plain" href={llmUrl} />
        {page.hasDataJson ? (
          <link rel="alternate" type="application/json" href={dataUrl} />
        ) : null}
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
