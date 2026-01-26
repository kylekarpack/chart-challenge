import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { getAllCharts, getChartBySlug } from "@/lib/charts";
import { getMDXComponents } from "@/app/mdx-components";
import { INaturalistSunburst } from "@/content/charts/inaturalist-sunburst/INaturalistSunburst";
import { HikeHistogram } from "@/content/charts/hike-histogram/HikeHistogram";
import { HikeHistogramSmallMultiples } from "@/content/charts/hike-histogram-small-multiples/HikeHistogramSmallMultiples";
import { MuchData } from "@/content/charts/much-data/MuchData";
import TideCharts from "@/content/charts/tide-charts/TideCharts";
import Racing from "@/content/charts/racing/Racing";

export async function generateStaticParams() {
  const charts = getAllCharts();
  return charts.map((chart) => ({
    slug: chart.slug,
  }));
}

export default async function ChartPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chart = getChartBySlug(slug);

  if (!chart) {
    notFound();
  }

  const components = {
    ...getMDXComponents(),
		Racing,
    TideCharts,
    MuchData,
    HikeHistogramSmallMultiples,
    HikeHistogram,
    INaturalistSunburst, // TODO: Remove this once we have a more general component
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-medium">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
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
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {chart.title}
          </h1>
          <time className="text-gray-500 text-lg">
            {new Date(`${chart.publishedAt}T00:00:00`).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </time>
        </header>

        <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-8">
          <MDXRemote source={chart.content} components={components} />
        </div>
      </article>
    </div>
  );
}
