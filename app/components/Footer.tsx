import Link from "next/link";
import ConfirmEmailLink from "./ConfirmEmailLink";

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
      <div className="container footer-grid footer-center">

        <nav className="footer-nav">
          <strong>Explore</strong>
          <ul>
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/info">About</Link></li>
            <li><ConfirmEmailLink label="Contact" variant="link" /></li>
          </ul>
          <div className="social" style={{ marginTop: 8 }}>
            <a
              className="btn btn-ghost"
              aria-label="Instagram"
              href="https://instagram.com/sistercore.atx"
              target="_blank"
              rel="noopener noreferrer"
              style={{ gap: 8 }}
            >
              <InstagramIcon style={{ color: "var(--text)" }} />
            </a>
          </div>
        </nav>
      </div>

      <div className="footer-bottom container" style={{ justifyContent: "center", gap: 12 }}>
        <span>© {year} Sister Core</span>
      </div>
    </footer>
  );
}
