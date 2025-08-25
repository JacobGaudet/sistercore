"use client";
import * as React from "react";

type Props = {
  totalCents: number;                 // price * qty
  onAdd: () => void;                  // your existing add-to-cart handler
  disabled?: boolean;                 // disable if variant/qty invalid
  leftDetail?: React.ReactNode;       // optional (e.g., chosen variant)
};

export default function MobileAddBar({ totalCents, onAdd, disabled, leftDetail }: Props) {
  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;

  return (
    <>
      {/* spacer so content isn't hidden behind the bar */}
      <div className="mobile-addbar-spacer" />

      <div className="mobile-addbar">
        <div className="mobile-addbar-left">
          <div className="total">{fmt(totalCents)}</div>
          {leftDetail ? <div className="detail">{leftDetail}</div> : null}
        </div>

        <button
          className="btn btn-primary mobile-addbar-btn"
          disabled={!!disabled}
          onClick={onAdd}
          aria-label="Add to cart"
        >
          Add to Cart
        </button>
      </div>
    </>
  );
}
