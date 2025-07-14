import fs from "fs";
import path from "path";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  description?: string;
  pubDate?: string;
};

export type BlogPost = {
  metadata: Metadata;
  slug: string;
  content: string;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match![1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".md");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function createSlug(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseNaturalDate(dateString: string): string {
  if (!dateString) return new Date().toISOString();

  // Remove quotes if present
  dateString = dateString.replace(/^['"](.*)['"]$/, "$1");

  // Handle formats like "March 14 2024" or "March 15, 2024"
  const cleanDateString = dateString.replace(",", "");
  const parsedDate = new Date(cleanDateString);

  // Check if the date is valid
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString();
  }

  // Fallback to current date if parsing fails
  console.warn(`Could not parse date: ${dateString}`);
  return new Date().toISOString();
}

function getMDXData(dir: string): BlogPost[] {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = createSlug(path.basename(file, path.extname(file)));

    // Normalize metadata fields to match expected format
    const normalizedMetadata = {
      title: metadata.title,
      publishedAt:
        parseNaturalDate(metadata.pubDate || metadata.publishedAt) ||
        new Date().toISOString(),
      summary:
        metadata.description ||
        metadata.summary ||
        content.substring(0, 150) + "...",
      image: metadata.image,
    };

    return {
      metadata: normalizedMetadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts(): BlogPost[] {
  return getMDXData(path.join(process.cwd(), "src", "app", "blog"));
}

export function getTrashPosts(): BlogPost[] {
  return getMDXData(path.join(process.cwd(), "src", "app", "trash"));
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
