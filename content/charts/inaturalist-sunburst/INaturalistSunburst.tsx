"use client";

import Link from "next/link";
import { ResponsiveSunburst } from "@nivo/sunburst";
import rawData from "./data.json";

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

// Transform flat taxonomy data into hierarchical structure for Nivo Sunburst
function transformToSunburstData(treeTaxa: TreeTaxon[]): SunburstNode {
  // Create a map of taxon ID to tree taxon data
  const taxonMap = new Map<number, TreeTaxon>();
  treeTaxa.forEach((item) => {
    taxonMap.set(item.taxon.id, item);
  });

  // Create a map to store the hierarchical nodes
  const nodeMap = new Map<number, SunburstNode>();

  // Build nodes for each taxon
  treeTaxa.forEach((item) => {
    const displayName = item.taxon.preferred_common_name || item.taxon.name;
    const node: SunburstNode = {
      id: `${item.taxon.id}-${displayName}`, // Use taxon ID + name for unique keys
      name: displayName,
      value: item.isLeaf ? item.count : undefined,
      children: [],
    };
    nodeMap.set(item.taxon.id, node);
  });

  // Build the hierarchy by linking children to parents
  let rootNode: SunburstNode | null = null;

  treeTaxa.forEach((item) => {
    const currentNode = nodeMap.get(item.taxon.id)!;
    const ancestorIds = item.taxon.ancestor_ids;

    // The root has only itself in ancestor_ids
    if (ancestorIds.length === 1) {
      rootNode = currentNode;
    } else {
      // Parent is the second-to-last in ancestor_ids
      const parentId = ancestorIds[ancestorIds.length - 2];
      const parentNode = nodeMap.get(parentId);

      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(currentNode);
      }
    }
  });

  // Clean up nodes with no children (remove empty children arrays for leaf nodes)
  const cleanNode = (node: SunburstNode): void => {
    if (node.children && node.children.length === 0) {
      delete node.children;
    } else if (node.children) {
      // If node has children, it shouldn't have a value
      delete node.value;
      node.children.forEach(cleanNode);
    }
  };

  if (rootNode) {
    cleanNode(rootNode);
  }

  return rootNode || { id: "empty", name: "No Data", value: 0 };
}

const data = transformToSunburstData(rawData.tree_taxa);

export const INaturalistSunburst = () => {
  return (
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
      tooltip={({ id, value, color, data }) => (
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
  );
};

export default function INaturalistSunburstPage() {
  return (
    <>
      <p className="text-base leading-7 mb-4 text-gray-700">
        Below is a sunburst chart of my iNaturalist observations in 2025. It is
        inspired by iNaturalist&apos;s year in review page, which showcases a
        similar chart. It&apos;s made with{" "}
        <Link
          href="https://nivo.rocks/"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Nivo
        </Link>{" "}
        and tracks everything that I identified in 2025. Observed taxa are
        arranged as a hierarchical diagram. The base of the hierarchy is at the
        center, starting with &quot;Life&quot; and ending with species at the
        outer edges. The size of each arc is proportional to the number of
        observations of that taxon.
      </p>
      <p className="text-base leading-7 mb-4 text-gray-700">
        Hover over each arc to see the details, including the number of
        observations of that taxon.
      </p>
      <div className="min-h-[800px] w-full">
        <INaturalistSunburst />
      </div>
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">
        Some issues and observations from building this chart:
      </h3>
      <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
        <li className="pl-2 pt-2">
          The data from iNaturalist is not in a format that is easy to use with
          Nivo. I had to transform it into a hierarchical structure, which I do
          at runtime
        </li>
        <li className="pl-2 pt-2">
          Nivo&apos;s labeling support isn&apos;t great, and labels couldn&apos;t
          wrap around the arcs nicely
        </li>
        <li className="pl-2 pt-2">
          A tree map may work better for this data, but I wanted to try
          something different
        </li>
      </ul>
    </>
  );
}
