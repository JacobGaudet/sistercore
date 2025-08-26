"use client";
import { useState } from "react";
import useScrollLock from "@/app/hooks/useScrollLock";

type Props = {
  label: string;
  email?: string;
  subject?: string;
  body?: string;
  variant?: "link" | "button";
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
  useScrollLock(open);
  const [accepted, setAccepted] = useState(false);
  const [copied, setCopied] = useState(false);

  const enc = (v: string) => encodeURIComponent(v);
  const s = enc(subject);
  const b = enc(body || "");

  const openMailto = () => {
    window.location.href = `mailto:${email}?subject=${s}${body ? `&body=${b}` : ""}`;
  };
  const openGmail = () => {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(email)}&su=${s}&body=${b}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const openOutlook = () => {
    window.open(
      `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(email)}&subject=${s}&body=${b}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback: show the email so the user can manually copy
      alert(`Email: ${email}`);
    }
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

      {open && (
        <>
          <div className="modal-backdrop" onClick={() => setOpen(false)} />
          <div className="modal" role="dialog" aria-modal="true" aria-label="Confirm email">
            <div className="modal-card">
              <h3>Contact Sister Core ATX</h3>
              <p className="lead" style={{ marginTop: 8 }}>
                You’re about to email <strong>{email}</strong>.
              </p>

              <ul className="hints" style={{ marginTop: 10 }}>
                <li>Pickup only (Austin, TX).</li>
                <li>For changes/cancellations, please email at least 48 hours in advance.</li>
                <li>If nothing opens on desktop, use the Gmail/Outlook buttons below.</li>
              </ul>

              <label className="inline" style={{ marginTop: 12, gap: 8 }}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span>I agree to these terms.</span>
              </label>

              <div className="modal-actions wrap">
                <button className="btn" onClick={() => { setOpen(false); setAccepted(false); }}>
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  disabled={!accepted}
                  onClick={() => { setOpen(false); openMailto(); setAccepted(false); }}
                  title="Open your default mail app"
                >
                  Default Mail app
                </button>

                <button
                  className="btn"
                  disabled={!accepted}
                  onClick={() => { setOpen(false); openGmail(); setAccepted(false); }}
                  title="Compose in Gmail (web)"
                >
                  Use Gmail
                </button>

                <button
                  className="btn"
                  disabled={!accepted}
                  onClick={() => { setOpen(false); openOutlook(); setAccepted(false); }}
                  title="Compose in Outlook.com (web)"
                >
                  Outlook.com
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={copyEmail}
                  title="Copy email address"
                >
                  {copied ? "Copied!" : "Copy email"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
