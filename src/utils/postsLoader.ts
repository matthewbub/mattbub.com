const blogModules = import.meta.glob("/src/markdown/blog/*.md", {
  as: "raw",
  eager: true,
});

const secondBrainModules = import.meta.glob("/src/markdown/second-brain/*.md", {
  as: "raw",
  eager: true,
});

export type PostSource = "blog" | "second-brain";

export type Post = {
  id: string;
  title: string;
  slug: string;
  filename: string;
  content: string;
  deck?: string;
  date?: string;
  tags?: string[];
  readTime?: string;
  author: string;
  source: PostSource;
  metadata: {
    frontmatter: Record<string, any>;
    excerpt: string;
  };
};

function parseMarkdownFrontmatter(content: string) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const frontmatterText = match[1];
  const bodyContent = match[2];
  const frontmatter: Record<string, any> = {};

  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex <= 0) return;

    const key = line.substring(0, colonIndex).trim();
    const value = line
      .substring(colonIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (value.startsWith("[") && value.endsWith("]")) {
      frontmatter[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
    } else {
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content: bodyContent };
}

function createSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createSlugFromFilename(filename: string): string {
  return createSlug(filename.replace(/\.md$/, ""));
}

function createTitleFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function extractExcerpt(content: string): string {
  const { content: bodyContent } = parseMarkdownFrontmatter(content);
  const firstParagraph = bodyContent
    .split("\n\n")[0]
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();

  return firstParagraph.length > 150
    ? firstParagraph.substring(0, 150) + "..."
    : firstParagraph;
}

function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

function parseDate(dateStr: string): string {
  if (dateStr.includes("T") || dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    return dateStr;
  }

  const parsed = new Date(dateStr);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
}

function defaultAuthorForSource(source: PostSource) {
  return source === "second-brain"
    ? "Marvin (AI assistant)"
    : "Matthew Bub";
}

function modulesToPosts(
  source: PostSource,
  modules: Record<string, unknown>
): Post[] {
  return Object.entries(modules).map(([path, content]) => {
    const filename = path.split("/").pop()?.replace(/\.md$/, "") || "";
    const raw = content as string;
    const { frontmatter, content: bodyContent } = parseMarkdownFrontmatter(raw);
    const baseSlug = frontmatter.slug || createSlugFromFilename(filename);

    return {
      id: `${source}:${createSlugFromFilename(filename)}`,
      title: frontmatter.title || createTitleFromFilename(filename),
      slug: createSlug(baseSlug),
      filename: `${filename}.md`,
      content: bodyContent,
      deck: frontmatter.deck || frontmatter.description || extractExcerpt(raw),
      date: parseDate(
        frontmatter.date || frontmatter.pubDate || new Date().toISOString()
      ),
      tags: frontmatter.tags || [],
      readTime: frontmatter.readTime || estimateReadTime(raw),
      author: frontmatter.author || defaultAuthorForSource(source),
      source,
      metadata: {
        frontmatter,
        excerpt: extractExcerpt(raw),
      },
    };
  });
}

function withUniqueSlugs(posts: Post[]): Post[] {
  const slugCount = new Map<string, number>();

  return posts.map((post) => {
    const count = slugCount.get(post.slug) || 0;
    slugCount.set(post.slug, count + 1);

    if (count === 0) return post;
    return {
      ...post,
      slug: `${post.slug}-${post.source}-${count + 1}`,
    };
  });
}

export function loadAllPosts(): Post[] {
  const posts = [
    ...modulesToPosts("blog", blogModules),
    ...modulesToPosts("second-brain", secondBrainModules),
  ];

  const sorted = posts.sort(
    (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
  );

  return withUniqueSlugs(sorted);
}

export function getPost(slug: string): Post | undefined {
  return loadAllPosts().find((post) => post.slug === slug);
}
