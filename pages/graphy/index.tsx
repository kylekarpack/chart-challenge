import ChartPageLayout from "@/components/ChartPageLayout";

export const meta = {
  slug: "graphy",
  title: "Graphy",
  publishedAt: "2026-03-13",
  summary: "Visualizing data with Graphy.",
} as const;

export default function Page() {
  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <p className="text-base leading-7 mb-4 text-gray-700">
        I played around with Graphy a bit and created a simple chart
        demonstrating a few features.
      </p>
      <iframe
        src="https://visualize.graphy.app/view/ba9b8383-c937-411d-b7ed-24a240c2b4a5"
        className="w-full h-[800px] mb-12"
        title="Graphy Chart"
      />
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">
        Takeaways:
      </h3>
      <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
        <li className="pl-2 pt-2">Graphy does a lot of neat things.</li>
        <li className="pl-2 pt-2">
          There are some strange bugs and omissions.
        </li>
        <li className="pl-2 pt-2">Usability was fantastic.</li>
      </ul>
    </ChartPageLayout>
  );
}
