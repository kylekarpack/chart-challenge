import { getChartBySlug, getAllCharts } from "@/lib/charts";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";

export const getStaticPaths: GetStaticPaths = () => {
  const charts = getAllCharts();
  return {
    paths: charts.map((chart) => ({ params: { slug: chart.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const chart = getChartBySlug(slug);
  if (!chart) {
    return { notFound: true };
  }
  return {
    props: {
      slug: chart.slug,
      title: chart.title,
      publishedAt: chart.publishedAt,
      summary: chart.summary,
    },
  };
};

export default function ChartPage({
  slug,
  title,
  publishedAt,
}: {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
}) {
  const chart = getChartBySlug(slug);
  if (!chart) return null;

  const PageContent = chart.PageContent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-medium"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Charts
        </Link>

        <header className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{title}</h1>
          <time className="text-gray-500 text-lg">
            {new Date(`${publishedAt}T00:00:00`).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-8">
          <PageContent />
        </div>
      </article>
    </div>
  );
}
