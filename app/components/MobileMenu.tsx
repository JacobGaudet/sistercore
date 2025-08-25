"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function MobileMenu({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  // lock scroll when open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className={`drawer-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <button className="drawer-close" onClick={onClose} aria-label="Close menu">✕</button>
        <nav className="drawer-nav">
          <Link href="/menu" onClick={onClose}>Menu</Link>
          <Link href="/info" onClick={onClose}>About & Policies</Link>
          <a href="mailto:orders@sistercoreatx.com" onClick={onClose}>Contact</a>
          <a href="https://instagram.com/sistercoreatx" target="_blank" rel="noopener noreferrer" onClick={onClose}>Instagram</a>
          <Link href="/cart" onClick={onClose}>Cart</Link>
        </nav>
      </aside>
    </>
  );
}
