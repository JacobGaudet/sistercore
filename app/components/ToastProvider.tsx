"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

type Toast = { id: number; message: string };
type ToastCtx = { show: (message: string) => void };
const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), 2400);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className="toast toast-enter" role="status">
            <span style={{ fontWeight: 700, color: "var(--accent)" }}>✓</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(){ 
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
}
