import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export default function Home() {
  return (
    <main className="container stack">
      <h1>Freshly Baked. Always Organic.</h1>
      <p className="lead">Order pickup or local delivery.</p>

      <div className="grid grid-2">
        {PRODUCTS.filter(p => p.active).map(p => (
          <div key={p.id} className="card stack">
            <div>
              <h2>{p.name}</h2>
              {p.description && <p className="lead">{p.description}</p>}
            </div>
            <div>
              <Link href={`/product/${p.slug}`} className="btn btn-primary">
                Customize & Order
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Link href="/cart" className="btn">View Cart</Link>
      </div>
    </main>
  );
}
