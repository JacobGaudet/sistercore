"use client";
import { useCart } from "./CartContext";
import { useState } from "react";

export default function CartPage() {
  const { items, remove, clear } = useCart();
  const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<"pickup"|"delivery">("pickup");
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryZip, setDeliveryZip] = useState("");
  const [note, setNote] = useState("");
  const [tipAmount, setTipAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.unitAmount * i.quantity, 0);

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, customerName, items, pickupDate, fulfillmentType, deliveryZip, note, tipAmount }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { checkoutUrl } = await res.json();
      clear();
      window.location.href = checkoutUrl;
    } catch {
      alert("Checkout failed. Check fields / ZIP / date.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container grid" style={{ gridTemplateColumns: "1.2fr .8fr", gap: "var(--space-5)" }}>
      {/* Left: Items & fulfillment */}
      <section className="stack">
        <div className="card stack">
          <h1>Your Cart</h1>
          {items.length === 0 ? <p className="lead">Your cart is empty.</p> : (
            <div className="stack">
              {items.map((it, i) => (
                <div key={i} className="row">
                  <div>
                    <strong>{it.name}</strong>{it.variantLabel ? ` – ${it.variantLabel}` : ""} × {it.quantity}
                  </div>
                  <div className="inline">
                    <span className="price">${(it.unitAmount * it.quantity / 100).toFixed(2)}</span>
                    <button className="btn btn-sm" onClick={() => remove(i)}>remove</button>
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
          <h2>Pickup / Delivery</h2>
          <fieldset className="stack">
            <legend className="label">Fulfillment</legend>
            <div className="inline">
              <label className="inline">
                <input type="radio" checked={fulfillmentType==="pickup"} onChange={() => setFulfillmentType("pickup")} />
                <span>Pickup</span>
              </label>
              <label className="inline">
                <input type="radio" checked={fulfillmentType==="delivery"} onChange={() => setFulfillmentType("delivery")} />
                <span>Delivery</span>
              </label>
            </div>
            {fulfillmentType==="delivery" && (
              <div className="field">
                <label className="label">Delivery ZIP</label>
                <input className="input" placeholder="e.g., 78704" value={deliveryZip} onChange={e=>setDeliveryZip(e.target.value)} />
              </div>
            )}
            <div className="field">
              <label className="label">Pickup/Delivery Date</label>
              <input className="input" type="date" value={pickupDate} onChange={e=>setPickupDate(e.target.value)} />
            </div>
          </fieldset>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Name</label>
              <input className="input" placeholder="Your name" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label className="label">Order note (optional)</label>
            <input className="input" placeholder="Allergies, writing on cake, etc." value={note} onChange={e=>setNote(e.target.value)} />
          </div>

          <div className="field">
            <label className="label">Tip (cents)</label>
            <input className="input" type="number" min={0} value={tipAmount} onChange={e=>setTipAmount(+e.target.value)} />
          </div>
        </div>
      </section>

      {/* Right: Summary / pay */}
      <aside className="card stack" style={{ position: "sticky", top: "90px", height: "fit-content" }}>
        <h2>Summary</h2>
        <div className="row"><span>Subtotal</span><span className="price">${(subtotal/100).toFixed(2)}</span></div>
        <p className="lead">Delivery fees/tax (if any) are shown on checkout.</p>
        <button
          className="btn btn-primary"
          disabled={!items.length || !email || !customerName || !pickupDate || (fulfillmentType==="delivery" && !deliveryZip) || loading}
          onClick={checkout}
        >
          {loading ? "Redirecting…" : "Checkout Securely"}
        </button>
      </aside>
    </main>
  );
}
