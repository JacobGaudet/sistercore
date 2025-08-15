"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  productId: string; variantId?: string; name: string; variantLabel?: string;
  unitAmount: number; quantity: number;
};
type CartCtx = { items: CartItem[]; add: (i: CartItem) => void; remove: (idx: number) => void; clear: () => void; };
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  return (
    <Ctx.Provider value={{
      items,
      add: (i) => setItems(prev => [...prev, i]),
      remove: (idx) => setItems(prev => prev.filter((_, i) => i !== idx)),
      clear: () => setItems([]),
    }}>
      {children}
    </Ctx.Provider>
  );
}
export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("CartProvider missing");
  return v;
};
