import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export default function MenuPage() {
  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;

  return (
    <main className="container stack">
      <h1>Menu</h1>
      <p className="lead">Choose your treats, then customize & add to cart.</p>

      <div className="grid grid-2">
        {PRODUCTS.filter((p) => p.active).map((p) => {
          const prices = p.variants?.map((v) => v.price) ?? (p.basePrice ? [p.basePrice] : []);
          const hasPrices = prices.length > 0;
          const min = hasPrices ? Math.min(...prices) : 0;
          const max = hasPrices ? Math.max(...prices) : 0;

          return (
            <div key={p.id} className="card stack">
              <div>
                <h2>{p.name}</h2>
                {p.description && <p className="lead">{p.description}</p>}
              </div>

              {hasPrices && (
                <div className="lead">
                  {min === max ? <>Price: <strong>{fmt(min)}</strong></> : <>From <strong>{fmt(min)}</strong> to <strong>{fmt(max)}</strong></>}
                </div>
              )}

              <div>
                <Link href={`/product/${p.slug}`} className="btn btn-primary">
                  Customize & Add
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
