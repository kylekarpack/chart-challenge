import ChartPageLayout from "@/components/ChartPageLayout";
import Image from "next/image";

export const meta = {
  slug: "splash",
  title: "SPLASH",
  publishedAt: "2026-03-23",
  summary: "SPLASH: Statistical Platform for Limnology, Analytics, and Stream Hydrology",
} as const;

export default function Page() {
  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <p className="text-base leading-7 mb-4 text-gray-700">
        SPLASH is a statistical analysis platform for hydrologists.
        It focuses on extracting data from WDM and DSS files and performing statistical analyses and charts.
      </p>

      <p className="text-base leading-7 mb-4 text-gray-700">
        It is built with Streamlit, Plotly, Python, and Rust, and is absolutely a work in progress.
        I will include a link here once it is deployed live.
      </p>
      <Image
        src="/images/splash.png"
        alt="SPLASH"
        width={1500}
        height={800}
      />
     
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">
        Takeaways:
      </h3>
      <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
        <li>Plotly is easy to use, but struggles with large datasets</li>
        <li>Streamlit is great for quick data applications</li>
        <li>Compiling USGS and Army Corps of Engineers Fortran utilities on an ARM64 Mac is leisure activity for lunatics</li>
      </ul>
    </ChartPageLayout>
  );
}
