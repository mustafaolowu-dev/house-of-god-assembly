export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-shell">
      <header className="blog-header">
        <a className="blog-brand" href="/" aria-label="House of God Assembly homepage">
          <strong>House of God Assembly</strong>
          <small>Hanover Park, Illinois</small>
        </a>
        <nav className="blog-nav" aria-label="Blog navigation">
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/#sermons">Sermons</a>
          <a href="/#prayer">Prayer Request</a>
          <a href="/?give=1#donate">Donate</a>
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
  );
}
