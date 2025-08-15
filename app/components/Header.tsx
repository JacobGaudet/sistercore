"use client";
import Link from "next/link";
import { useCart } from "@/app/cart/CartContext";

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return (
    <header className="site-header">
      <nav className="nav container">
        <Link href="/" className="brand">Sister Core</Link>
        <div className="nav-actions">
          <Link href="/cart" className="btn btn-ghost">
            Cart <span className="badge">{count}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
