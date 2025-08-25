"use client";
import { useState } from "react";

type Props = {
  label: string;                 // text shown to the user
  email?: string;                // default: orders@sistercoreatx.com
  subject?: string;              // default subject
  body?: string;                 // optional prefill body
  variant?: "link" | "button";   // visual style (inline link or button)
  className?: string;
};

export default function ConfirmEmailLink({
  label,
  email = "orders@sistercoreatx.com",
  subject = "Order inquiry — Sister Core ATX",
  body,
  variant = "link",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const mailto = () => {
    const s = encodeURIComponent(subject);
    const b = body ? `&body=${encodeURIComponent(body)}` : "";
    window.location.href = `mailto:${email}?subject=${s}${b}`;
  };

  const trigger = (
    <button
      type="button"
      className={variant === "link" ? `link ${className}` : `btn btn-ghost ${className}`}
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={open}
    >
      {label}
    </button>
  );

  return (
    <>
      {trigger}

      {/* Modal */}
      {open && (
        <>
          <div className="modal-backdrop" onClick={() => setOpen(false)} />
          <div className="modal" role="dialog" aria-modal="true" aria-label="Confirm email">
            <div className="modal-card">
              <h3>Contact Sister Core ATX</h3>
              <p className="lead" style={{ marginTop: 8 }}>
                You’re about to open your email app to write to <strong>{email}</strong>.
              </p>
              <ul className="hints" style={{ marginTop: 10 }}>
                <li>Pickup only (Austin, TX).</li>
                <li>For changes/cancellations, please email at least 48 hours in advance.</li>
                <li>Email replies aren’t instant—thanks for your patience!</li>
              </ul>

              <label className="inline" style={{ marginTop: 12, gap: 8 }}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span>I agree to these terms.</span>
              </label>

              <div className="modal-actions">
                <button className="btn" onClick={() => { setOpen(false); setAccepted(false); }}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!accepted}
                  onClick={() => { setOpen(false); mailto(); setAccepted(false); }}
                >
                  Continue to Email
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
