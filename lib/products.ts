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
    active: boolean;
  };

export const PRODUCTS: Product[] = [
  {
    id: "cookies",
    name: "Chocolate Chip Cookies",
    slug: "choc-chip-cookies",
    active: true,
    description: "Soft and chewy cookie filled with chocolate chips and finished with a sprinkle of sea salt.",
    variants: [
      { id: "4",  name: "4-Pack",      price: 800,  leadDays: 1 },  // 4/$8
      { id: "12", name: "Dozen (12)",  price: 2000, leadDays: 2 },  // 12/$20
    ],
  },

  // ——— Banana Bread ———
  {
    id: "banana-bread",
    name: "Banana Bread",
    slug: "banana-bread",
    active: true,
    description: "Delicious banana loaf with a brown sugar cinnamon crumble on top.",
    variants: [
      { id: "mini",     name: "Mini Loaf",     price: 600,  leadDays: 1 }, // $6
      { id: "standard", name: "Standard Loaf", price: 1200, leadDays: 2 }, // $12
    ],
  },

  // ——— Lemon Poppyseed Muffin ———
  {
    id: "lemon-poppyseed-muffin",
    name: "Lemon Poppyseed Muffin",
    slug: "lemon-poppyseed-muffin",
    active: true,
    description: "Zingy lemon muffin with poppyseeds throughout, topped with a tasty glaze.",
    variants: [
      { id: "single", name: "Single",  price: 400,  leadDays: 1 }, // 1/$4
      { id: "4",      name: "4-Pack",  price: 1600, leadDays: 1 }, // 4/$16
    ],
  },

  // ——— Sourdough Cinnamon Rolls ———
  {
    id: "sourdough-cinnamon-rolls",
    name: "Sourdough Cinnamon Rolls",
    slug: "sourdough-cinnamon-rolls",
    active: true,
    description: "Soft, pillowy buns swirled with cinnamon sugar and topped with cream cheese frosting.",
    variants: [
      { id: "single", name: "Single",  price: 600,  leadDays: 2 }, // 1/$6
      { id: "4",      name: "4-Pack",  price: 2000, leadDays: 2 }, // 4/$20
    ],
  },

  // ——— Brownies (single price) ———
  {
    id: "double-chocolate-brownie",
    name: "Double Chocolate Brownie",
    slug: "double-chocolate-brownie",
    active: true,
    description: "Ooey gooey chocolatey goodness mixed with chocolate chips.",
    basePrice: 400, // $4 each; quantity handled on product page
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
