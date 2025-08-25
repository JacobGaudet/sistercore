// app/page.tsx
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export default function Home() {
  const featured = PRODUCTS.filter(p => p.active).slice(0, 3);

  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;
  const priceRange = (p: (typeof PRODUCTS)[number]) => {
    const prices = p.variants?.map(v => v.price) ?? (p.basePrice ? [p.basePrice] : []);
    if (!prices.length) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? fmt(min) : `${fmt(min)}–${fmt(max)}`;
  };

  return (
    <main className="container stack">
      {/* HERO */}
      <section className="hero card stack">
        <div className="kicker">Austin, TX • Pickup & Local Delivery</div>
        <h1>Freshly Baked, Sister-Made</h1>
        <p className="lead">
          Pastel treats & wrapped Mystery Books with spoiler-free clues. Order online,
          schedule pickup or local delivery.
        </p>
        <div className="inline">
          <Link href="/menu" className="btn btn-primary">Start an Order</Link>
          <Link href="/info" className="btn">About & Policies</Link>
          <a href="https://instagram.com/sistercoreatx" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Instagram</a>
        </div>
      </section>

      {/* FEATURED ITEMS */}
      <section className="stack">
        <h2>Popular This Week</h2>
        <div className="grid grid-2">
          {featured.map(p => (
            <div key={p.id} className="card stack">
              <div>
                <h3>{p.name}</h3>
                {p.description && <p className="lead">{p.description}</p>}
              </div>
              <div className="inline" style={{ justifyContent: "space-between" }}>
                <span className="lead">{priceRange(p) ? <>From <strong>{priceRange(p)}</strong></> : null}</span>
                <Link href={`/product/${p.slug}`} className="btn btn-primary">Customize & Add</Link>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Link href="/menu" className="btn">See Full Menu</Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="stack">
        <h2>How It Works</h2>
        <div className="features">
          <div className="feature card">
            <div className="feature-icon">🧁</div>
            <h3>Pick your treats</h3>
            <p className="lead">Choose cupcakes, cookies, or our wrapped Mystery Book gift.</p>
          </div>
          <div className="feature card">
            <div className="feature-icon">📅</div>
            <h3>Choose a date</h3>
            <p className="lead">Select pickup or local delivery at checkout. Lead times show per item.</p>
          </div>
          <div className="feature card">
            <div className="feature-icon">🔒</div>
            <h3>Pay securely</h3>
            <p className="lead">Stripe checkout—cards and mobile wallets supported.</p>
          </div>
        </div>
      </section>

      {/* MYSTERY BOOK PROMO */}
      <section className="promo card stack">
        <div className="kicker">Giftable & Fun</div>
        <h2>Mystery Book (with clues!)</h2>
        <p className="lead">
          Pick a style—Cozy, Thriller, Historical, Literary, or Romantic Suspense—
          and we include spoiler-free clues like “It’s like…” comps.
        </p>
        <Link href="/product/mysterybook" className="btn btn-primary">Choose a Style</Link>
      </section>

      {/* PICKUP & DELIVERY INFO */}
      <section className="grid grid-2">
        <div className="card stack">
          <h2>Pickup / Delivery</h2>
          <p className="lead">
            We currently offer pickup and select ZIP delivery in Austin. Exact options and any delivery fees are shown at checkout.
          </p>
          <p className="lead">Questions? <a href="mailto:orders@sistercoreatx.com">orders@sistercoreatx.com</a></p>
        </div>
        <div className="card stack">
          <h2>Allergens & Notes</h2>
          <p className="lead">
            Our kitchen handles wheat, dairy, eggs, and nuts. Leave allergy notes or writing for cakes in the order notes at checkout.
          </p>
          <Link href="/info" className="btn">Read policies</Link>
        </div>
      </section>
    </main>
  );
}
