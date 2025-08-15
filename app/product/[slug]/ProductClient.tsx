"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/app/cart/CartContext";
import type { Product } from "@/lib/products";

export default function ProductClient({ product }: { product: Product }) {
  const { add } = useCart();

  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [qty, setQty] = useState(1);

  const selected = useMemo(
    () => product.variants?.find((v) => v.id === variantId),
    [product.variants, variantId]
  );

  const unitAmount = selected?.price ?? product.basePrice ?? 0;

  return (
    <main className="container">
      <div className="card stack">
        <div>
          <h1>{product.name}</h1>
          {product.description && <p className="lead">{product.description}</p>}
        </div>

        {product.variants && (
          <div className="field">
            <label className="label">Variant</label>
            <select value={variantId} onChange={(e) => setVariantId(e.target.value)}>
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="inline">
          <div className="field">
            <label className="label">Quantity</label>
            <input
              className="input"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(+e.target.value)}
            />
          </div>
          <div style={{ marginLeft: "auto", alignSelf: "end" }}>
            <span className="price">${(unitAmount * qty / 100).toFixed(2)}</span>
          </div>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={() =>
              add({
                productId: product.id,
                variantId,
                name: product.name,
                variantLabel: selected?.name,
                unitAmount,
                quantity: qty,
              })
            }
          >
            Add to cart
          </button>
        </div>
      </div>
    </main>
  );
}
