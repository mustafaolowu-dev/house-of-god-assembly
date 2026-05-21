import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog and Bible Study",
  description:
    "Sermon articles, Bible study notes, Christian teachings, and online worship updates from House of God Assembly in Hanover Park, Illinois.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "House of God Assembly Blog and Bible Study",
    description:
      "Read sermon articles, Bible study notes, Christian teachings, and online worship updates from House of God Assembly.",
    url: "/blog",
    images: ["/assets/bible-study-card.svg"]
  }
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main>
      <section className="blog-hero">
        <p className="eyebrow">Blog and Bible Study</p>
        <h1>Sermon articles and Bible teachings.</h1>
        <p>
          Read House of God Assembly sermon notes, Christian teachings, Bible study articles, prayer encouragement,
          and online worship updates from Hanover Park, Illinois.
        </p>
      </section>

      {posts.length ? (
        <section className="blog-grid" aria-label="Latest sermon articles and Bible study posts">
          {posts.map((post) => (
            <article className="post-card" key={post.slug}>
              <img src={post.featuredImage} alt="" width="900" height="700" loading="lazy" />
              <div className="post-card-content">
                <span className="post-date">
                  {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
                    new Date(post.date)
                  )}
                </span>
                <h2>{post.title}</h2>
                <p className="post-summary">{post.description}</p>
                <ul className="tag-list" aria-label={`${post.title} tags`}>
                  {post.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <a className="read-link" href={`/blog/${post.slug}`}>
                  Read article
                </a>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>No blog posts published yet.</h2>
          <p className="post-summary">
            Add markdown files to <code>content/blog</code> or publish through the API endpoint.
          </p>
        </section>
      )}
    </main>
  );
}
