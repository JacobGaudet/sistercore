"use client";
import { useCart } from "./CartContext";
import { useState } from "react";

export default function CartPage() {
  const { items, remove, clear } = useCart();

  const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [pickupDate, setPickupDate] = useState(""); // YYYY-MM-DD
  const [note, setNote] = useState("");
  const [tipAmount, setTipAmount] = useState(0); // cents
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.unitAmount * i.quantity, 0);

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, customerName, items, pickupDate, note, tipAmount }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { checkoutUrl } = await res.json();
      clear();
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Please check your email, name, and pickup date.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container cart-layout">
      {/* Left: Items & pickup details */}
      <section className="stack">
        <div className="card stack">
          <h1>Your Cart</h1>
          {items.length === 0 ? (
            <p className="lead">Your cart is empty.</p>
          ) : (
            <div className="stack">
              {items.map((it, i) => (
                <div key={i} className="row row-wrap">
                  {/* Allow this cell to shrink on small screens */}
                  <div className="shrinkable">
                    <strong>{it.name}</strong>
                    {it.variantLabel ? ` – ${it.variantLabel}` : ""} × {it.quantity}
                  </div>
                  <div className="inline">
                    <span className="price">
                      ${((it.unitAmount * it.quantity) / 100).toFixed(2)}
                    </span>
                    <button className="btn btn-sm" onClick={() => remove(i)}>
                      remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="row">
                <span>Subtotal</span>
                <span className="price">${(subtotal / 100).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="card stack">
          <h2>Pickup Details</h2>

          <div className="field">
            <label className="label">Pickup date</label>
            <input
              className="input"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>

          <div className="two-col">
            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label">Name</label>
              <input
                className="input"
                placeholder="Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Order note (optional)</label>
            <input
              className="input"
              placeholder="Allergies, writing on cake, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Tip (optional, cents)</label>
            <input
              className="input"
              type="number"
              min={0}
              value={tipAmount}
              onChange={(e) => setTipAmount(Math.max(0, +e.target.value || 0))}
            />
          </div>
        </div>
      </section>

      {/* Right: Summary / pay */}
      <aside className="card stack sticky-aside">
        <h2>Summary</h2>
        <div className="row">
          <span>Subtotal</span>
          <span className="price">${(subtotal / 100).toFixed(2)}</span>
        </div>
        <p className="lead">You’ll choose a pickup date and pay securely on the next step.</p>
        <button
          className="btn btn-primary"
          disabled={!items.length || !email || !customerName || !pickupDate || loading}
          onClick={checkout}
        >
          {loading ? "Redirecting…" : "Checkout Securely"}
        </button>
      </aside>
    </main>
  );
}
