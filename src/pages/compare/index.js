import CompareIndex from "@/components/Compare/CompareIndex";

export default function CompareIndexPage({ pages }) {
  return <CompareIndex pages={pages} />;
}

export async function getStaticProps() {
  const { getCompareSummaries } = await import("@/lib/compareContent");
  return { props: { pages: getCompareSummaries() } };
}
