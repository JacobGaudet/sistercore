"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/cart/CartContext";
import { useEffect, useState } from "react";

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
        <Link href="/" className="brand-link" aria-label="Sister Core ATX - Home">
          <div className="brand-wrap">
            <Image
              src="/logo.jpeg"
              alt="Sister Core ATX"
              width={32}
              height={32}
              priority
            />
            <span className="brand-text">Sister&nbsp;Core&nbsp;ATX</span>
          </div>
        </Link>

        <div className="nav-actions">
          <Link href="/menu" className="btn btn-ghost">Menu</Link>
          <Link href="/cart" className="btn btn-primary">
            Cart <span className={`badge ${bump ? "bump" : ""}`}>{count}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
