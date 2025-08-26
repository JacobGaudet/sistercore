"use client";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ConfirmEmailLink from "./ConfirmEmailLink";

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function MobileMenu({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  // lock page scroll while drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className={`drawer-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <button className="drawer-close" onClick={onClose} aria-label="Close menu">✕</button>

        <nav className="drawer-nav">
          <ul className="drawer-list">
            <li>
              <Link
                href="/menu"
                className={`drawer-link ${isActive("/menu") ? "active" : ""}`}
                onClick={onClose}
                aria-current={isActive("/menu") ? "page" : undefined}
              >
                <span>Menu</span>
                <ChevronRight className="chev" />
              </Link>
            </li>
            <li>
              <Link
                href="/info"
                className={`drawer-link ${isActive("/info") ? "active" : ""}`}
                onClick={onClose}
                aria-current={isActive("/info") ? "page" : undefined}
              >
                <span>About & Policies</span>
                <ChevronRight className="chev" />
              </Link>
            </li>
            <li>
              {/* Contact uses your confirmation modal but styled like other links */}
              <ConfirmEmailLink
                label="Contact"
                variant="link"
                className="drawer-link"
              />
            </li>
            <li>
              <a
                href="https://instagram.com/sistercore.atx"
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-link"
                onClick={onClose}
              >
                <span>Instagram</span>
                <ChevronRight className="chev" />
              </a>
            </li>
            <li>
              <Link
                href="/cart"
                className={`drawer-link ${isActive("/cart") ? "active" : ""}`}
                onClick={onClose}
                aria-current={isActive("/cart") ? "page" : undefined}
              >
                <span>Cart</span>
                <ChevronRight className="chev" />
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
