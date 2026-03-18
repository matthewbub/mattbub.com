import { parseMarkdownFrontmatter } from "./markdownFrontmatter";

// Auto-import all markdown files from the blog directory
const markdownModules = import.meta.glob("/src/markdown/blog/*.md", {
  as: "raw",
  eager: true,
});

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  filename: string;
  content: string;
  deck?: string;
  date?: string;
  tags?: string[];
  readTime?: string;
  metadata: {
    frontmatter: Record<string, any>;
    excerpt: string;
  };
};

function createSlugFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractExcerpt(content: string): string {
  // Remove frontmatter and get first paragraph
  const { content: bodyContent } = parseMarkdownFrontmatter(content);
  const firstParagraph = bodyContent
    .split("\n\n")[0]
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/`(.*?)`/g, "$1") // Remove code
    .trim();

  return firstParagraph.length > 150
    ? firstParagraph.substring(0, 150) + "..."
    : firstParagraph;
}

function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

function parseDate(dateStr: string): string {
  // Handle various date formats
  if (dateStr.includes("T") || dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    return dateStr; // Already ISO format
  }

  // Handle "February 29 2024" format
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  // Fallback to current date
  return new Date().toISOString();
}

function createTitleFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add spaces before capitals
    .trim();
}

export function loadAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  Object.entries(markdownModules).forEach(([path, content]) => {
    const filename = path.split("/").pop()?.replace(/\.md$/, "") || "";
    const { frontmatter, content: bodyContent } = parseMarkdownFrontmatter(
      content as string
    );

    const post: BlogPost = {
      id: createSlugFromFilename(filename),
      title: frontmatter.title || createTitleFromFilename(filename),
      slug: frontmatter.slug || createSlugFromFilename(filename),
      filename: filename + ".md",
      content: bodyContent,
      deck:
        frontmatter.deck ||
        frontmatter.description ||
        extractExcerpt(content as string),
      date: parseDate(
        frontmatter.date || frontmatter.pubDate || new Date().toISOString()
      ),
      tags: frontmatter.tags || [],
      readTime: frontmatter.readTime || estimateReadTime(bodyContent),
      metadata: {
        frontmatter,
        excerpt: extractExcerpt(content as string),
      },
    };

    posts.push(post);
  });

  // Sort by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
  );
}

export function getBlogPost(slug: string): BlogPost | undefined {
  const posts = loadAllBlogPosts();
  return posts.find((post) => post.slug === slug);
}
