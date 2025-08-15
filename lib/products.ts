export type Variant = { 
    id: string; 
    name: string; 
    price: number; 
    leadDays: number
    notes?: string[];
 };
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
  {
  id: "mysterybook",
  name: "Mystery Book",
  slug: "mysterybook",
  active: true,
  description: "Choose a wrapped mystery book — perfect for gifts! Pick a style, we’ll include clues (no spoilers).",
  variants: [
    {
      id: "cozy",
      name: "Cozy Mystery",
      price: 1200,
      leadDays: 1,
      notes: [
        "Small-town charm, amateur sleuth, light peril",
        "Warm, funny side characters, comforting pace",
        "It’s like: The Thursday Murder Club / Agatha vibes",
      ],
    },
    {
      id: "thriller",
      name: "Psychological Thriller",
      price: 1200,
      leadDays: 1,
      notes: [
        "Fast-paced, twisty, unreliable narration",
        "Edge-of-your-seat chapters, late-night page turns",
        "It’s like: Gone Girl / The Girl on the Train",
      ],
    },
    {
      id: "historical",
      name: "Historical Mystery",
      price: 1200,
      leadDays: 1,
      notes: [
        "Period setting (1920s–1950s), clue-driven puzzle",
        "Atmospheric details, classic whodunnit feel",
        "It’s like: Maisie Dobbs / Christie-era sleuthing",
      ],
    },
    {
      id: "literary",
      name: "Literary Mystery",
      price: 1200,
      leadDays: 1,
      notes: [
        "Character-forward, elegant prose, layered themes",
        "Slow-burn tension with a resonant payoff",
        "It’s like: Tana French / Donna Tartt vibes",
      ],
    },
    {
      id: "romantic",
      name: "Romantic Suspense",
      price: 1200,
      leadDays: 1,
      notes: [
        "Danger + swoon, protective leads, HEA-adjacent",
        "Modern pacing, chemistry on the page",
        "It’s like: Colleen Hoover (darker) / Karen Rose",
      ],
    },
  ],
},
];
