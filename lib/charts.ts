import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { globSync } from "glob";

const chartsDirectory = path.join(process.cwd(), "content/charts");

export interface Chart {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  content: string;
}

export function getAllCharts(): Chart[] {
  // Ensure directory exists
  if (!fs.existsSync(chartsDirectory)) {
    return [];
  }

  // Use glob to find all MDX files recursively
  const pattern = path.join(chartsDirectory, "**/*.mdx");
  const files = globSync(pattern, { windowsPathsNoEscape: true });
  
  const allCharts = files
    .map((fullPath: string) => {
      // Get relative path from chartsDirectory and remove .mdx extension
      const relativePath = path.relative(chartsDirectory, fullPath);
      let slug = relativePath.replace(/\.mdx$/, "").replace(/\\/g, "/");
      
      // Handle index files: folder/index.mdx -> folder
      if (slug.endsWith("/index")) {
        slug = slug.replace(/\/index$/, "");
      }
      
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        publishedAt: data.publishedAt || "",
        summary: data.summary || "",
        content,
      };
    });

  // Sort charts by date
  return allCharts.sort((a: Chart, b: Chart) => {
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getChartBySlug(slug: string): Chart | null {
  // Normalize slug to handle both forward and backward slashes
  const normalizedSlug = slug.replace(/\\/g, "/");
  
  // Try direct file path first (e.g., slug.mdx)
  let fullPath = path.join(chartsDirectory, `${normalizedSlug}.mdx`);
  
  // If not found, try as an index file (e.g., slug/index.mdx)
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(chartsDirectory, normalizedSlug, "index.mdx");
    if (!fs.existsSync(fullPath)) {
      return null;
    }
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: normalizedSlug,
    title: data.title || "",
    publishedAt: data.publishedAt || "",
    summary: data.summary || "",
    content,
  };
}
