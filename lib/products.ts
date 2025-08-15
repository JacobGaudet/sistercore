export type Variant = { 
    id: string; 
    name: string; 
    price: number; 
    leadDays: number };
export type Product = { 
    id: string; 
    name: string; 
    slug: string; 
    description?: string;
    basePrice?: number;
    variants?: Variant[]; 
    active: boolean };

export const PRODUCTS: Product[] = [
  {
    id: "bananabread",
    name: "Banana Bread",
    slug: "bananabread",
    active: true,
    variants: [
      { id: "singleloaf", name: "Single Loaf", price: 1000, leadDays: 1 },
    ],
    description: "Fresh-baked banana bread.",
  },
  {
    id: "cookies",
    name: "Cookies",
    slug: "cookies",
    active: true,
    variants: [
      { id: "3pack",  name: "3-Pack",      price: 500,  leadDays: 1 },
      { id: "12pack", name: "Dozen (12)",  price: 2000, leadDays: 1 },
    ],
    description: "Fresh-baked cookies in small or party-size packs.",
  },
];
