"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function DesktopNav() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    // Small delay lets users move through tiny gaps without closing the menu
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={rootRef}
      className="dropdown only-desktop"
      onMouseEnter={() => { clearCloseTimer(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="btn btn-ghost dropdown-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        Explore
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ marginLeft: 6 }}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      <div
        className={`dropdown-menu ${open ? "open" : ""}`}
        role="menu"
        aria-label="Site navigation"
        // keep open while hovering the menu itself
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleClose}
      >
        <Link href="/menu" role="menuitem" className="menu-item">Menu</Link>
        <Link href="/info" role="menuitem" className="menu-item">About &amp; Policies</Link>
      </div>
    </div>
  );
}
