import Head from "next/head";
import CompareArticle from "@/components/Compare/CompareArticle";
import { discoveryUrl } from "@/lib/site";

export default function GuideArticlePage({ page }) {
  const llmUrl = discoveryUrl(`/guides/${encodeURIComponent(page.slug)}/llm.txt`);
  return (
    <>
      <Head>
        <title>{`${page.metaTitle} | viaSocket Discovery`}</title>
        <meta name="description" content={page.description} />
        {page.authorName ? <meta name="author" content={page.authorName} /> : null}
        <link rel="canonical" href={page.canonical} />
        <meta property="og:title" content={page.metaTitle} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={page.canonical} />
        <meta property="og:type" content="article" />
        <link rel="alternate" type="text/plain" href={llmUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.jsonLd }}
        />
      </Head>
      <CompareArticle page={page} section="Guide" />
    </>
  );
}

export async function getStaticPaths() {
  const { getGuideSummaries } = await import("@/lib/guideContent");
  return {
    paths: getGuideSummaries().map((page) => ({ params: { slug: page.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { getGuidePage } = await import("@/lib/guideContent");
  const page = getGuidePage(params.slug);
  if (!page) return { notFound: true };
  return { props: { page } };
}
