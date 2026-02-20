#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_API_URL = "https://sbrain-production.up.railway.app";
const DEFAULT_OUTPUT_DIR = "src/markdown/second-brain";

function parseArgs(argv) {
  const args = {
    dryRun: false,
    prune: false,
    apiUrl: process.env.SBRAIN_API_URL || DEFAULT_API_URL,
    outDir: DEFAULT_OUTPUT_DIR,
    project: "",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (arg === "--prune") {
      args.prune = true;
      continue;
    }

    if (arg === "--api-url") {
      args.apiUrl = argv[i + 1] || "";
      i += 1;
      continue;
    }

    if (arg === "--out-dir") {
      args.outDir = argv[i + 1] || DEFAULT_OUTPUT_DIR;
      i += 1;
      continue;
    }

    if (arg === "--project") {
      args.project = argv[i + 1] || "";
      i += 1;
      continue;
    }

    if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printHelp() {
  console.log(`Sync sbrain API posts to markdown files.

Usage:
  node scripts/sync-second-brain.mjs [options]

Options:
  --dry-run            Print planned changes without writing files
  --prune              Remove managed files missing from API response
  --project <name>     Only sync records for a specific project
  --api-url <url>      API base URL (default: SBRAIN_API_URL or ${DEFAULT_API_URL})
  --out-dir <path>     Output directory (default: ${DEFAULT_OUTPUT_DIR})
  -h, --help           Show help
`);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";
}

function yamlQuote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function parseTags(tagsValue) {
  const raw = (tagsValue || "").trim();
  if (!raw) return [];

  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return dedupeStrings(parsed.map((v) => String(v).trim()).filter(Boolean));
      }
    } catch {
      // Fall through to delimiter parsing.
    }
  }

  return dedupeStrings(
    raw
      .split(/[|,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

function dedupeStrings(values) {
  return [...new Set(values)];
}

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      frontmatter[key] = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    } else if (/^-?\d+$/.test(value)) {
      frontmatter[key] = Number(value);
    } else {
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

function getManagedIdFromFileName(fileName) {
  const match = fileName.match(/^(\d+)-/);
  if (!match) return null;
  return Number(match[1]);
}

function renderMarkdown(record) {
  const title = (record.title || "Untitled").trim();
  const date = record.created_at || new Date().toISOString();
  const id = Number(record.id);
  const tags = parseTags(record.tags);
  const slug = slugify(title);
  const context = (record.context || "").replace(/\r\n/g, "\n").trim();
  const commits = (record.commits || "").trim();
  const project = (record.project || "").trim();

  const frontmatterLines = [
    "---",
    `title: ${yamlQuote(title)}`,
    `date: ${yamlQuote(date)}`,
    `slug: ${yamlQuote(slug)}`,
    `author: ${yamlQuote("Marvin (AI assistant)")}`,
    `brainId: ${id}`,
    `project: ${yamlQuote(project)}`,
    `tags: [${tags.map(yamlQuote).join(", ")}]`,
    "---",
    "",
  ];

  let body = context;
  if (commits) {
    body += `\n\n## Commits\n\n\`\`\`text\n${commits}\n\`\`\``;
  }

  return `${frontmatterLines.join("\n")}${body}\n`;
}

async function getExistingManagedFiles(outDir) {
  const result = new Map();
  const entries = await fs.readdir(outDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const fullPath = path.join(outDir, entry.name);
    const content = await fs.readFile(fullPath, "utf8");
    const frontmatter = parseFrontmatter(content);

    let id = Number(frontmatter.brainId);
    if (!Number.isInteger(id) || id <= 0) {
      const fromName = getManagedIdFromFileName(entry.name);
      if (fromName) id = fromName;
    }

    if (Number.isInteger(id) && id > 0) {
      result.set(id, { fileName: entry.name, fullPath, content });
    }
  }

  return result;
}

async function fetchBrains(apiUrl) {
  const endpoint = `${apiUrl.replace(/\/$/, "")}/brain`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid API payload: expected an array from /brain");
  }

  return data;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(process.cwd(), args.outDir);

  await fs.mkdir(outDir, { recursive: true });

  const brains = await fetchBrains(args.apiUrl);
  const filtered = args.project
    ? brains.filter((b) => String(b.project || "") === args.project)
    : brains;

  filtered.sort((a, b) => Number(a.id) - Number(b.id));

  const existing = await getExistingManagedFiles(outDir);
  const seenIds = new Set();

  let created = 0;
  let updated = 0;
  let unchanged = 0;
  let renamed = 0;
  let removed = 0;

  for (const record of filtered) {
    const id = Number(record.id);
    if (!Number.isInteger(id) || id <= 0) {
      console.warn(`Skipping record with invalid id: ${record.id}`);
      continue;
    }

    if (seenIds.has(id)) {
      console.warn(`Skipping duplicate API record id=${id}`);
      continue;
    }
    seenIds.add(id);

    const slug = slugify(record.title || "untitled");
    const targetFileName = `${id}-${slug}.md`;
    const targetPath = path.join(outDir, targetFileName);
    const nextContent = renderMarkdown(record);

    const current = existing.get(id);
    if (!current) {
      created += 1;
      console.log(`${args.dryRun ? "[dry-run] " : ""}create ${path.relative(process.cwd(), targetPath)}`);
      if (!args.dryRun) {
        await fs.writeFile(targetPath, nextContent, "utf8");
      }
      continue;
    }

    const nameChanged = current.fileName !== targetFileName;
    if (nameChanged) {
      renamed += 1;
      console.log(
        `${args.dryRun ? "[dry-run] " : ""}rename ${path.relative(process.cwd(), current.fullPath)} -> ${path.relative(process.cwd(), targetPath)}`
      );
      if (!args.dryRun) {
        await fs.rename(current.fullPath, targetPath);
      }
      current.fullPath = targetPath;
      current.fileName = targetFileName;
    }

    if (current.content !== nextContent) {
      updated += 1;
      console.log(`${args.dryRun ? "[dry-run] " : ""}update ${path.relative(process.cwd(), targetPath)}`);
      if (!args.dryRun) {
        await fs.writeFile(targetPath, nextContent, "utf8");
      }
    } else {
      unchanged += 1;
    }
  }

  if (args.prune) {
    for (const [id, file] of existing.entries()) {
      if (seenIds.has(id)) continue;
      removed += 1;
      console.log(`${args.dryRun ? "[dry-run] " : ""}remove ${path.relative(process.cwd(), file.fullPath)}`);
      if (!args.dryRun) {
        await fs.unlink(file.fullPath);
      }
    }
  }

  console.log(
    `\nDone. total=${filtered.length} created=${created} updated=${updated} renamed=${renamed} unchanged=${unchanged} removed=${removed}`
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
