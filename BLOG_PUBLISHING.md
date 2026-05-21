# Automated Blog Publishing

House of God Assembly now supports filesystem markdown blog posts and a lightweight publishing API for tools such as Arvow. No Sanity CMS is required.

## Markdown Posts

Add sermon articles and Bible studies as `.md` files in:

```text
content/blog
```

Each post uses frontmatter:

```md
---
title: "Sunday Worship Service Notes"
description: "A short SEO summary for Google and social sharing."
date: "2026-05-21T10:00:00.000Z"
author: "House of God Assembly"
featuredImage: "/assets/bible-study-card.svg"
tags: ["Sermons", "Bible Study", "Prayer"]
---

# Article title

Write the sermon article or Bible study content here.
```

Published routes:

```text
/blog
/blog/your-post-slug
```

## API Endpoint

External publishing tools can create or update posts by sending a POST request to:

```text
/api/blog/publish
```

Headers:

```text
Authorization: Bearer YOUR_BLOG_PUBLISH_TOKEN
Content-Type: application/json
```

Example payload:

```json
{
  "title": "Sunday Worship Service Notes",
  "description": "Bible teaching notes from House of God Assembly in Hanover Park, Illinois.",
  "slug": "sunday-worship-service-notes",
  "body": "# Sunday Worship Service Notes\n\nWrite the sermon article in markdown.",
  "tags": ["Sermons", "Sunday Worship", "Bible Teaching"],
  "featuredImage": "/assets/online-worship-card.svg",
  "author": "House of God Assembly"
}
```

## Vercel Environment Variables

Set these in Vercel Project Settings:

```text
BLOG_PUBLISH_TOKEN=choose-a-long-secret-token
GITHUB_REPO=mustafaolowu-dev/house-of-god-assembly
GITHUB_BRANCH=main
GITHUB_TOKEN=github-token-with-repo-contents-write-access
```

In production, the API commits markdown files into GitHub because Vercel cannot permanently write new files to the deployed filesystem. GitHub should then trigger a Vercel redeploy so the new article appears on the site.
