"use client";
import Link from "next/link";
import { useCart } from "@/app/cart/CartContext";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import DesktopNav from "./DesktopNav";

function BurgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  const [bump, setBump] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 500);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <header className="site-header">
      <nav className="nav container nav-compact">
        {/* left: burger on mobile */}
        <button className="only-mobile btn btn-ghost" aria-label="Open menu" onClick={() => setOpen(true)}>
          <BurgerIcon />
        </button>

        {/* middle: spacer (no brand text) */}
        <div className="nav-spacer" />

        {/* right: actions */}
        <div className="nav-actions">
          <DesktopNav />                      {/* ⬅️ new dropdown for desktop */}
          <Link href="/cart" className="btn btn-primary">
            Cart <span className={`badge ${bump ? "bump" : ""}`}>{count}</span>
          </Link>
        </div>
      </nav>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
