import Link from "next/link";
import Image from "next/image";
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
    <main className="container stack toptight">

      {/* HERO */}
      <section className="hero card stack">
        <div className="kicker">Austin, TX • Pickup Only</div>
        <h1>Freshly Baked, Sister-Made</h1>
        <p className="lead">
          Always organic and scratch made! Order online and schedule a pickup time.
        </p>
        <div className="inline">
          <Link href="/menu" className="btn btn-primary">Start an Order</Link>
          <a href="https://instagram.com/sistercore.atx" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Instagram</a>
        </div>
      </section>

      {/* FEATURED ITEMS */}
      <section className="stack">
        <h2>Popular This Week</h2>
        <div className="scroll-x">
          {featured.map(p => (
            <div key={p.id} className="card stack">
              <div>
                <h3>{p.name}</h3>
                {p.description && <p className="lead">{p.description}</p>}
              </div>
              <div className="inline" style={{ justifyContent: "space-between" }}>
                <span className="lead">
                  {priceRange(p) ? <>From <strong>{priceRange(p)}</strong></> : null}
                </span>
                <Link href={`/product/${p.slug}`} className="btn btn-primary">Customize & Add</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="stack">
        <h2>How It Works</h2>
        <div className="features">
          <div className="feature card">
            <div className="feature-icon">🍪</div>
            <h3>Pick your treats</h3>
            <p className="lead">Choose from our selection of homemade bakes, or pick out a wrapped Mystery Book.</p>
          </div>
          <div className="feature card">
            <div className="feature-icon">📅</div>
            <h3>Choose a date</h3>
            <p className="lead">Select a pickup date at checkout. Lead times show per item.</p>
          </div>
          <div className="feature card">
            <div className="feature-icon">🔒</div>
            <h3>Pay securely</h3>
            <p className="lead">Stripe checkout—cards and mobile wallets supported.</p>
          </div>
        </div>
      </section>

      {/* PICKUP INFO */}
      <section className="grid grid-2">
      <div className="card stack">
        <h2>Pickup Info</h2>
        <p className="lead">
          We currently offer <strong>pickup only</strong> in Austin. You’ll choose
          an available pickup date during checkout and get an email confirmation.
        </p>
        <p className="lead">Questions? <a href="mailto:orders@sistercoreatx.com">orders@sistercoreatx.com</a></p>
      </div>
      <div className="card stack">
        <h2>Allergens & Notes</h2>
        <p className="lead">
          Our kitchen handles wheat, dairy, eggs, and nuts. Leave allergy notes or
          writing for cakes in the order notes at checkout.
        </p>
        <a href="/info" className="btn">Read policies</a>
      </div>
    </section>
    </main>
  );
}
