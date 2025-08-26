// app/menu/page.tsx
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import ConfirmEmailLink from "@/app/components/ConfirmEmailLink";

export const metadata = {
  title: "Menu — Sister Core",
  description: "Pickup-only menu: cookies, banana bread, muffins, cinnamon rolls, and brownies.",
};

export default function MenuPage() {
  const items = PRODUCTS.filter((p) => p.active);

  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;
  const priceRange = (p: (typeof PRODUCTS)[number]) => {
    const prices = p.variants?.map((v) => v.price) ?? (p.basePrice ? [p.basePrice] : []);
    if (!prices.length) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? fmt(min) : `${fmt(min)}–${fmt(max)}`;
  };

  return (
    <main className="container stack">
      <h1>Menu</h1>

      <div className="grid grid-2">
        {items.map((p) => (
          <article key={p.id} className="card stack">
            <div>
              <h3>{p.name}</h3>
              {p.description && <p className="lead">{p.description}</p>}
            </div>
            <div className="inline" style={{ justifyContent: "space-between" }}>
              <span className="lead">
                {priceRange(p) ? <>From <strong>{priceRange(p)}</strong></> : null}
              </span>
              <Link href={`/product/${p.slug}`} className="btn btn-primary">
                Select
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="card stack">
        <h2>Need something custom?</h2>
        <p className="lead">
          Have a special request or a larger order? We’re happy to help.
        </p>
        <ConfirmEmailLink
          label="Inquire for custom order"
          variant="button"
          subject="Custom order inquiry — Sister Core ATX"
          body={
            "Hi Sister Core,\n\nI’m interested in a custom order:\n• Item(s):\n• Quantity:\n• Desired pickup date:\n\nThanks!"
          }
        />
      </section>
    </main>
  );
}
