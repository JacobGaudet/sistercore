import Link from "next/link";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand brand-gradient">Sister&nbsp;Core&nbsp;ATX</div>
        
        </div>

        <nav className="footer-nav">
          <strong>Explore</strong>
          <ul>
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/info">About & Policies</Link></li>
            <li><a href="mailto:orders@sistercoreatx.com">Contact</a></li>
          </ul>
        </nav>

        <div className="footer-contact">
          <strong>Stay in touch</strong>
          <p style={{ marginTop: 8 }}>
            Austin, TX •{" "}
            <a href="mailto:orders@sistercoreatx.com">orders@sistercoreatx.com</a>
          </p>
          <div className="social" style={{ marginTop: 8 }}>
            <a
              className="btn btn-ghost"
              aria-label="Instagram"
              href="https://instagram.com/sistercoreatx"
              target="_blank"
              rel="noopener noreferrer"
              style={{ gap: 8 }}
            >
              <InstagramIcon style={{ color: "var(--accent)" }} />
              <span>@sistercoreatx</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>© {year} Sister Core ATX</span>
        <a href="#top" className="btn btn-sm btn-ghost">Back to top ↑</a>
      </div>
    </footer>
  );
}
