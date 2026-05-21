import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getBlogDirectory, serializeMarkdownPost, slugify, type BlogPostInput } from "@/lib/blog";

export const runtime = "nodejs";

type PublishPayload = BlogPostInput & {
  status?: "draft" | "published";
};

export async function POST(request: NextRequest) {
  const authResult = authorize(request);
  if (authResult) return authResult;

  let payload: PublishPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const validationError = validatePayload(payload);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const post = serializeMarkdownPost({
    title: payload.title,
    description: payload.description,
    body: payload.body,
    slug: payload.slug,
    date: payload.date,
    author: payload.author,
    tags: payload.tags,
    featuredImage: payload.featuredImage
  });

  const repository = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_CONTENT_TOKEN;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (repository && token) {
    try {
      const result = await publishToGitHub({
        repository,
        token,
        branch,
        path: `content/blog/${post.filename}`,
        content: post.markdown,
        title: payload.title
      });

      return NextResponse.json({
        ok: true,
        mode: "github",
        slug: post.slug,
        path: `content/blog/${post.filename}`,
        commit: result.commit?.sha,
        url: `/blog/${post.slug}`
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "GitHub publishing failed." },
        { status: 502 }
      );
    }
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "GitHub publishing is not configured. Set GITHUB_REPO and GITHUB_TOKEN in Vercel environment variables."
      },
      { status: 501 }
    );
  }

  await fs.mkdir(getBlogDirectory(), { recursive: true });
  await fs.writeFile(path.join(getBlogDirectory(), post.filename), post.markdown, "utf8");

  return NextResponse.json({
    ok: true,
    mode: "filesystem",
    slug: post.slug,
    path: `content/blog/${post.filename}`,
    url: `/blog/${post.slug}`
  });
}

function authorize(request: NextRequest) {
  const expectedToken = process.env.BLOG_PUBLISH_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { error: "Publishing token is not configured. Set BLOG_PUBLISH_TOKEN in Vercel." },
      { status: 501 }
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return null;
}

function validatePayload(payload: Partial<PublishPayload>) {
  if (!payload.title || payload.title.trim().length < 4) return "Title is required.";
  if (!payload.description || payload.description.trim().length < 20) return "Description is required.";
  if (!payload.body || payload.body.trim().length < 40) return "Markdown body is required.";
  if (payload.slug && slugify(payload.slug) !== payload.slug) {
    return "Slug must be lowercase URL text, for example sunday-worship-service-notes.";
  }
  if (payload.tags && !Array.isArray(payload.tags)) return "Tags must be an array of strings.";
  return null;
}

async function publishToGitHub({
  repository,
  token,
  branch,
  path: filePath,
  content,
  title
}: {
  repository: string;
  token: string;
  branch: string;
  path: string;
  content: string;
  title: string;
}) {
  const url = `https://api.github.com/repos/${repository}/contents/${filePath}`;
  const existing = await fetch(`${url}?ref=${branch}`, {
    headers: githubHeaders(token),
    cache: "no-store"
  });

  let sha: string | undefined;
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  } else if (existing.status !== 404) {
    const details = await existing.text();
    throw new Error(`GitHub lookup failed: ${details}`);
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message: `Publish blog post: ${title}`,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
      sha
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`GitHub publish failed: ${details}`);
  }

  return response.json();
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json"
  };
}
