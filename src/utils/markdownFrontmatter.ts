export type MarkdownFrontmatter = Record<string, any>;

export function parseMarkdownFrontmatter(raw: string): {
  frontmatter: MarkdownFrontmatter;
  content: string;
} {
  const normalized = raw.replace(/\r\n?/g, "\n");

  if (!normalized.startsWith("---\n")) {
    return { frontmatter: {}, content: normalized };
  }

  const lines = normalized.split("\n");
  let closingIndex = -1;

  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].trim() === "---") {
      closingIndex = index;
      break;
    }
  }

  if (closingIndex === -1) {
    return { frontmatter: {}, content: normalized };
  }

  const frontmatterLines = lines.slice(1, closingIndex);
  const content = lines.slice(closingIndex + 1).join("\n");
  const frontmatter: MarkdownFrontmatter = {};

  for (let index = 0; index < frontmatterLines.length; index += 1) {
    const line = frontmatterLines[index];
    const colonIndex = line.indexOf(":");

    if (colonIndex <= 0) {
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    if (!value) {
      const indentedLines: string[] = [];

      while (
        index + 1 < frontmatterLines.length &&
        /^\s+/.test(frontmatterLines[index + 1])
      ) {
        indentedLines.push(frontmatterLines[index + 1].trim());
        index += 1;
      }

      value = indentedLines.join(" ");
    }

    frontmatter[key] = parseFrontmatterValue(value);
  }

  return { frontmatter, content };
}

function parseFrontmatterValue(value: string): any {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const items = trimmed.slice(1, -1).trim();

    if (!items) {
      return [];
    }

    return items
      .split(",")
      .map((item) => stripWrappingQuotes(item.trim()))
      .filter(Boolean);
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  return stripWrappingQuotes(trimmed);
}

function stripWrappingQuotes(value: string): string {
  return value.replace(/^["']|["']$/g, "");
}
