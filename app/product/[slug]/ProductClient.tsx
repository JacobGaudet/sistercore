"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/app/cart/CartContext";
import type { Product } from "@/lib/products";
import { useToast } from "@/app/components/ToastProvider";
import MobileAddBar from "@/app/components/MobileAddBar";

export default function ProductClient({ product }: { product: Product }) {
  const { add } = useCart();
  const { show } = useToast();

  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [qty, setQty] = useState(1);

  const selected = useMemo(
    () => product.variants?.find((v) => v.id === variantId),
    [product.variants, variantId]
  );

  const unitAmount = selected?.price ?? product.basePrice ?? 0;
  const totalCents = useMemo(() => Math.max(0, unitAmount * qty), [unitAmount, qty]);
  const hasNotes = !!selected?.notes?.length;

  const disabled = !unitAmount || qty <= 0 || (product.variants && !variantId);

  const onAdd = () => {
    if (disabled) return;
    add({
      productId: product.id,
      variantId,
      name: product.name,
      variantLabel: selected?.name,
      unitAmount,
      quantity: qty,
    });
    show(
      `Added ${qty} ${selected?.name ? `${selected.name} ` : ""}${product.name} to cart`
    );
  };

  return (
    <main className="container">
      <div className="card stack">
        <div>
          <h1>{product.name}</h1>
          {product.description && <p className="lead">{product.description}</p>}
        </div>

        {/* If variants have notes, show chips; otherwise a select */}
        {product.variants?.some((v) => v.notes?.length) ? (
          <div className="field">
            <label className="label">Choose a style</label>
            <div className="chips" role="radiogroup" aria-label="Mystery style">
              {product.variants.map((v) => (
                <label
                  key={v.id}
                  className={`chip ${variantId === v.id ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="style"
                    value={v.id}
                    checked={variantId === v.id}
                    onChange={() => setVariantId(v.id)}
                    aria-checked={variantId === v.id}
                    aria-label={v.name}
                  />
                  {v.name}
                </label>
              ))}
            </div>
          </div>
        ) : (
          product.variants && (
            <div className="field">
              <label className="label">Variant</label>
              <select
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )
        )}

        {/* Live-updating clues */}
        {hasNotes && (
          <div className="card stack">
            <h3>Clues (no spoilers)</h3>
            <ul className="hints">
              {selected?.notes?.map((n, i) => (
                <li key={i}>• {n}</li>
              ))}
            </ul>
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
              onChange={(e) => setQty(Math.max(1, +e.target.value || 1))}
            />
          </div>
          <div style={{ marginLeft: "auto", alignSelf: "end" }}>
            <span className="price">${(totalCents / 100).toFixed(2)}</span>
          </div>
        </div>

        {/* Desktop button (mobile uses sticky bar below) */}
        <div className="only-desktop">
          <button className="btn btn-primary" onClick={onAdd} disabled={disabled}>
            Add to cart
          </button>
        </div>
      </div>

      {/* Sticky Add-to-Cart bar for mobile */}
      <MobileAddBar
        totalCents={totalCents}
        onAdd={onAdd}
        disabled={disabled}
        leftDetail={
          product.variants ? (
            <span>
              {selected?.name ?? product.name} · {qty}×
            </span>
          ) : (
            <span>{qty}×</span>
          )
        }
      />
    </main>
  );
}
