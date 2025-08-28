"use client";
import { useEffect, useState } from "react";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}
function parseCents(input: string) {
  // keep digits only; "12.34" or "$12,34" -> "1234" -> 1234 cents
  const digits = input.replace(/[^\d]/g, "");
  return digits ? Math.min(99_999_999, parseInt(digits, 10)) : 0; // clamp high just in case
}

export default function MoneyInput({
  valueCents,
  onChange,
  placeholder = "$0.00",
  className = "input",
  ariaLabel = "Amount",
}: {
  valueCents: number;
  onChange: (cents: number) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const [display, setDisplay] = useState(formatCents(valueCents));

  // keep display in sync if parent resets value
  useEffect(() => {
    setDisplay(formatCents(valueCents));
  }, [valueCents]);

  return (
    <input
      type="text"                // we format ourselves
      inputMode="numeric"        // mobile numeric keypad
      pattern="[0-9]*"
      className={className}
      aria-label={ariaLabel}
      value={display}
      placeholder={placeholder}
      onChange={(e) => {
        const cents = parseCents(e.target.value);
        setDisplay(formatCents(cents));
        onChange(cents);
      }}
      onFocus={(e) => {
        // Optional: show raw dollars without $ while editing
        // Comment out if you prefer always-formatted
        // const cents = parseCents(e.currentTarget.value);
        // e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
      }}
    />
  );
}
