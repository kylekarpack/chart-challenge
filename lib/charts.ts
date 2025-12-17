import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { globSync } from "glob";

const postsDirectory = path.join(process.cwd(), "content/charts");

export interface Chart {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  content: string;
}

export function getAllCharts(): Chart[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // Use glob to find all MDX files recursively
  const pattern = path.join(postsDirectory, "**/*.mdx");
  const files = globSync(pattern, { windowsPathsNoEscape: true });

  console.log(files);
  
  const allPostsData = files
    .map((fullPath: string) => {
      // Get relative path from postsDirectory and remove .mdx extension
      const relativePath = path.relative(postsDirectory, fullPath);
      const slug = relativePath.replace(/\.mdx$/, "").replace(/\\/g, "/");
      
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

  // Sort posts by date
  return allPostsData.sort((a: Chart, b: Chart) => {
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): Chart | null {
  // Normalize slug to handle both forward and backward slashes
  const normalizedSlug = slug.replace(/\\/g, "/");
  const fullPath = path.join(postsDirectory, `${normalizedSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
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
