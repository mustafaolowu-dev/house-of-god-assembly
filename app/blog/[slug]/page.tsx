import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/blog/${post.slug}`,
      images: [post.featuredImage]
    }
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="article">
      <article>
        <header className="article-header">
          <p className="eyebrow">Sermon article and Bible study</p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <div className="article-meta">
            <span>{post.author}</span>
            <span> | </span>
            <time dateTime={post.date}>
              {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
                new Date(post.date)
              )}
            </time>
          </div>
          <ul className="tag-list" aria-label={`${post.title} tags`}>
            {post.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </header>

        <div className="article-image">
          <img src={post.featuredImage} alt="" width="1200" height="720" loading="eager" />
        </div>

        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Organization",
              name: post.author
            },
            publisher: {
              "@type": "Organization",
              name: "House of God Assembly",
              url: "https://www.houseofgodassembly.com"
            },
            image: post.featuredImage,
            keywords: post.tags.join(", "),
            mainEntityOfPage: `https://www.houseofgodassembly.com/blog/${post.slug}`
          })
        }}
      />
    </main>
  );
}
