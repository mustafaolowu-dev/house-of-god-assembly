import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.houseofgodassembly.com"),
  title: {
    default: "House of God Assembly Blog | Sermons, Bible Study & Online Worship",
    template: "%s | House of God Assembly"
  },
  description:
    "Read sermon articles, Bible study notes, Christian teachings, and online worship updates from House of God Assembly in Hanover Park, Illinois.",
  openGraph: {
    type: "website",
    siteName: "House of God Assembly",
    images: ["/assets/online-worship-hero.svg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="blog-shell">
          <header className="blog-header">
            <a className="blog-brand" href="/index.html" aria-label="House of God Assembly homepage">
              <strong>House of God Assembly</strong>
              <small>Hanover Park, Illinois</small>
            </a>
            <nav className="blog-nav" aria-label="Blog navigation">
              <a href="/index.html">Home</a>
              <a href="/blog">Blog</a>
              <a href="/index.html#sermons">Sermons</a>
              <a href="/index.html#prayer">Prayer Request</a>
              <a href="/index.html?give=1#donate">Donate</a>
              <a href="https://www.youtube.com/@HOUSEOFGODASSEMBLY" target="_blank" rel="noreferrer">
                Watch Live
              </a>
            </nav>
          </header>
          {children}
          <footer className="blog-footer">
            <strong>House of God Assembly</strong>
            <span>Online worship, Bible teaching, sermons, prayer, and global outreach.</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
