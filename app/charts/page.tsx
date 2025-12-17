import Link from "next/link";
import { getAllCharts, type Chart } from "@/lib/charts";

export default function ChartsPage() {
  const charts = getAllCharts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Chart Challenge
          </h1>
          <p className="text-xl text-gray-600">
            A personal challenge to create and explore new data visualizations
            regularly
          </p>
        </div>

        <div className="space-y-8">
          {charts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No charts yet. Check back soon!
              </p>
            </div>
          ) : (
            charts.map((chart: Chart) => (
              <article
                key={chart.slug}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
              >
                <Link href={`/charts/${chart.slug}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {chart.title}
                  </h2>
                </Link>
                <time className="text-sm text-gray-500 mb-3 block">
                  {new Date(`${chart.publishedAt}T00:00:00`).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </time>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {chart.summary}
                </p>
                <Link
                  href={`/charts/${chart.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                >
                  Read more
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
