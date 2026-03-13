const docsModules = import.meta.glob("/src/markdown/docs/*.md", {
  as: "raw",
  eager: true,
});

export type DocProject = {
  slug: string;
  title: string;
  description: string;
  version: string;
  repo: string;
  content: string;
  headings: DocHeading[];
};

export type DocHeading = {
  id: string;
  text: string;
  level: number;
};

function parseMarkdownFrontmatter(raw: string) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { frontmatter: {} as Record<string, string>, content: raw };

  const frontmatter: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i <= 0) return;
    frontmatter[line.substring(0, i).trim()] = line
      .substring(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  });

  return { frontmatter, content: match[2] };
}

function extractHeadings(content: string): DocHeading[] {
  const headings: DocHeading[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;

    const text = match[2].replace(/`/g, "");
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    headings.push({ id, text, level: match[1].length });
  }

  return headings;
}

function slugFromPath(path: string): string {
  return (path.split("/").pop() || "").replace(/\.md$/, "");
}

export function loadAllDocs(): DocProject[] {
  return Object.entries(docsModules)
    .map(([path, raw]) => {
      const { frontmatter, content } = parseMarkdownFrontmatter(raw as string);
      return {
        slug: slugFromPath(path),
        title: frontmatter.title || slugFromPath(path),
        description: frontmatter.description || "",
        version: frontmatter.version || "",
        repo: frontmatter.repo || "",
        content,
        headings: extractHeadings(content),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getDoc(slug: string): DocProject | undefined {
  return loadAllDocs().find((d) => d.slug === slug);
}
