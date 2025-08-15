"use client";
import Link from "next/link";
import { useCart } from "@/app/cart/CartContext";
import { useEffect, useState } from "react";

function CupcakeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 10c0-2.761 2.686-5 6-5s6 2.239 6 5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 11h16l-2 7a3 3 0 0 1-2.9 2H8.9A3 3 0 0 1 6 18l-2-7Z" fill="currentColor" opacity=".12"/>
      <path d="M4 11h16l-2 7a3 3 0 0 1-2.9 2H8.9A3 3 0 0 1 6 18l-2-7Z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 500);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <header className="site-header">
      <nav className="nav container">
        <Link href="/" className="brand">
          <span className="brand-gradient">Sister&nbsp;Core</span>
        </Link>
        <div className="nav-actions">
          <Link href="/menu" className="btn btn-ghost">
            <CupcakeIcon style={{ color: "var(--accent)" }}/> Menu
          </Link>
          <Link href="/cart" className="btn btn-primary">
            Cart <span className={`badge ${bump ? "bump" : ""}`}>{count}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
