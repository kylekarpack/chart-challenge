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
  treeTaxa.forEach(item => {
    taxonMap.set(item.taxon.id, item);
  });

  // Create a map to store the hierarchical nodes
  const nodeMap = new Map<number, SunburstNode>();

  // Build nodes for each taxon
  treeTaxa.forEach(item => {
    const displayName = item.taxon.preferred_common_name || item.taxon.name;
    const node: SunburstNode = {
      id: `${item.taxon.id}-${displayName}`, // Use taxon ID + name for unique keys
      name: displayName,
      value: item.isLeaf ? item.count : undefined,
      children: []
    };
    nodeMap.set(item.taxon.id, node);
  });

  // Build the hierarchy by linking children to parents
  let rootNode: SunburstNode | null = null;

  treeTaxa.forEach(item => {
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
    <>
      <ResponsiveSunburst
        data={data}
        id="id"
        value="value"
        colors={{scheme: "pastel2"}}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        cornerRadius={2}
        enableArcLabels={true}
        arcLabel={d => `${d.data.name} (${d.percentage.toFixed(1)}%)`}
        arcLabelsSkipAngle={25}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 3]] }}
      />
    </>
  );
};
