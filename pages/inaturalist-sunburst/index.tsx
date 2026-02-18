"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import Link from "next/link";
import { ResponsiveSunburst } from "@nivo/sunburst";
import rawData from "./data.json";

export const meta = {
  slug: "inaturalist-sunburst",
  title: "iNaturalist Sunburst",
  publishedAt: "2025-12-16",
  summary: "A sunburst chart of my iNaturalist observations in 2025.",
} as const;

interface Taxon {
  id: number;
  name: string;
  iconic_taxon_id: number | null;
  preferred_common_name?: string;
  rank: string;
  ancestor_ids: number[];
}

interface TreeTaxon {
  count: number;
  taxon: Taxon;
  isLeaf: boolean;
}

interface SunburstNode {
  id: string;
  name: string;
  value?: number;
  children?: SunburstNode[];
}

function transformToSunburstData(treeTaxa: TreeTaxon[]): SunburstNode {
  const nodeMap = new Map<number, SunburstNode>();

  treeTaxa.forEach((item) => {
    const displayName = item.taxon.preferred_common_name || item.taxon.name;
    const node: SunburstNode = {
      id: `${item.taxon.id}-${displayName}`,
      name: displayName,
      value: item.isLeaf ? item.count : undefined,
      children: [],
    };
    nodeMap.set(item.taxon.id, node);
  });

  let rootNode: SunburstNode | null = null;

  treeTaxa.forEach((item) => {
    const currentNode = nodeMap.get(item.taxon.id)!;
    const ancestorIds = item.taxon.ancestor_ids;

    if (ancestorIds.length === 1) {
      rootNode = currentNode;
    } else {
      const parentId = ancestorIds[ancestorIds.length - 2];
      const parentNode = nodeMap.get(parentId);
      if (parentNode) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push(currentNode);
      }
    }
  });

  const cleanNode = (node: SunburstNode): void => {
    if (node.children && node.children.length === 0) {
      delete node.children;
    } else if (node.children) {
      delete node.value;
      node.children.forEach(cleanNode);
    }
  };

  if (rootNode) cleanNode(rootNode);

  return rootNode || { id: "empty", name: "No Data", value: 0 };
}

const data = transformToSunburstData((rawData as { tree_taxa: TreeTaxon[] }).tree_taxa);

function ChartContent() {
  return (
    <>
      <p className="text-base leading-7 mb-4 text-gray-700">
        Below is a sunburst chart of my iNaturalist observations in 2025. It is inspired by iNaturalist&apos;s year in review page, which showcases a similar chart. It&apos;s made with{" "}
        <Link href="https://nivo.rocks/" className="text-blue-600 hover:text-blue-800 underline">
          Nivo
        </Link>{" "}
        and tracks everything that I identified in 2025. Observed taxa are arranged as a hierarchical diagram. The base of the hierarchy is at the center, starting with &quot;Life&quot; and ending with species at the outer edges. The size of each arc is proportional to the number of observations of that taxon.
      </p>
      <p className="text-base leading-7 mb-4 text-gray-700">
        Hover over each arc to see the details, including the number of observations of that taxon.
      </p>
      <div className="min-h-[800px] w-full">
        <ResponsiveSunburst
          data={data}
          id="id"
          value="value"
          colors={{ scheme: "pastel2" }}
          cornerRadius={2}
          enableArcLabels={true}
          arcLabel="formattedValue"
          arcLabelsSkipAngle={15}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          tooltip={({ value, color, data }) => (
            <div
              style={{
                backgroundColor: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                minWidth: 200,
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <strong style={{ color }}>{data.name}:</strong> {value} observations
            </div>
          )}
        />
      </div>
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">Some issues and observations from building this chart:</h3>
      <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
        <li className="pl-2 pt-2">
          The data from iNaturalist is not in a format that is easy to use with Nivo. I had to transform it into a hierarchical structure, which I do at runtime
        </li>
        <li className="pl-2 pt-2">
          Nivo&apos;s labeling support isn&apos;t great, and labels couldn&apos;t wrap around the arcs nicely
        </li>
        <li className="pl-2 pt-2">A tree map may work better for this data, but I wanted to try something different</li>
      </ul>
    </>
  );
}

export default function Page() {
  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <ChartContent />
    </ChartPageLayout>
  );
}
