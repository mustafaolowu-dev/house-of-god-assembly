import fs from "node:fs";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  featuredImage: string;
  body: string;
  html: string;
};

export type BlogPostInput = {
  title: string;
  description: string;
  body: string;
  slug?: string;
  date?: string;
  author?: string;
  tags?: string[];
  featuredImage?: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function getBlogDirectory() {
  return BLOG_DIR;
}

export function serializeMarkdownPost(input: BlogPostInput) {
  const slug = slugify(input.slug || input.title);
  const date = input.date || new Date().toISOString();
  const author = input.author || "House of God Assembly";
  const featuredImage = input.featuredImage || "/assets/bible-study-card.svg";
  const tags = input.tags || ["Bible Study", "Sermons", "Christian Teaching"];

  const frontmatter = [
    "---",
    `title: "${escapeYaml(input.title)}"`,
    `description: "${escapeYaml(input.description)}"`,
    `date: "${date}"`,
    `author: "${escapeYaml(author)}"`,
    `featuredImage: "${escapeYaml(featuredImage)}"`,
    `tags: [${tags.map((tag) => `"${escapeYaml(tag)}"`).join(", ")}]`,
    "---"
  ].join("\n");

  return {
    slug,
    filename: `${slug}.md`,
    markdown: `${frontmatter}\n\n${input.body.trim()}\n`
  };
}

export function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => getPostBySlug(file.replace(/\.md$/, "")))
    .filter(Boolean)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date)) as BlogPost[];
}

export function getPostBySlug(slug: string) {
  const safeSlug = slugify(slug);
  const filePath = path.join(BLOG_DIR, `${safeSlug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);

  return {
    slug: safeSlug,
    title: data.title || titleFromSlug(safeSlug),
    description: data.description || "Bible teaching and sermon article from House of God Assembly.",
    date: data.date || new Date().toISOString(),
    author: data.author || "House of God Assembly",
    tags: parseTags(data.tags),
    featuredImage: data.featuredImage || "/assets/bible-study-card.svg",
    body,
    html: markdownToHtml(body)
  };
}

export function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return { data: {} as Record<string, string>, body: raw };

  const closing = raw.indexOf("\n---", 3);
  if (closing === -1) return { data: {} as Record<string, string>, body: raw };

  const frontmatter = raw.slice(3, closing).trim();
  const body = raw.slice(closing + 4).trim();
  const data: Record<string, string> = {};

  for (const line of frontmatter.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    data[key] = value.replace(/^["']|["']$/g, "");
  }

  return { data, body };
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.split("\n");
  const blocks: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(`<ul>${listItems.join("")}</ul>`);
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("- ")) {
      listItems.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
      continue;
    }

    flushList();

    if (trimmed.startsWith("### ")) blocks.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
    else if (trimmed.startsWith("## ")) blocks.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
    else if (trimmed.startsWith("# ")) blocks.push(`<h1>${inlineMarkdown(trimmed.slice(2))}</h1>`);
    else if (trimmed.startsWith("> ")) blocks.push(`<blockquote>${inlineMarkdown(trimmed.slice(2))}</blockquote>`);
    else blocks.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  }

  flushList();
  return blocks.join("\n");
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function parseTags(value?: string) {
  if (!value) return [];
  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function titleFromSlug(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeYaml(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
