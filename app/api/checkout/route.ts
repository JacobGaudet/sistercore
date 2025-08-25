// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import {
  CAPACITY_PER_DAY,
  MAX_DAYS_AHEAD,
  startOfDay,
  endOfDay,
} from "@/lib/order-policy";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ---- Types for incoming payload (from Cart) ----
type CheckoutItem = {
  productId: string;
  variantId?: string;
  quantity: number;
};

type CheckoutBody = {
  email: string;
  customerName: string;
  pickupDate: string; // YYYY-MM-DD
  note?: string;
  tipAmount?: number; // cents
  items: CheckoutItem[];
};

// ---- Helpers ----
function parseBody(json: unknown): CheckoutBody | null {
  if (typeof json !== "object" || json === null) return null;
  const b = json as Record<string, unknown>;
  if (
    typeof b.email !== "string" ||
    typeof b.customerName !== "string" ||
    typeof b.pickupDate !== "string" ||
    !Array.isArray(b.items)
  ) {
    return null;
  }
  const items: CheckoutItem[] = b.items
    .map((it) => {
      const x = it as Record<string, unknown>;
      const productId = typeof x.productId === "string" ? x.productId : "";
      const variantId =
        typeof x.variantId === "string" ? (x.variantId as string) : undefined;
      const quantity =
        typeof x.quantity === "number" && x.quantity > 0
          ? Math.floor(x.quantity)
          : 0;
      return { productId, variantId, quantity };
    })
    .filter((x) => x.productId && x.quantity > 0);

  return {
    email: b.email as string,
    customerName: b.customerName as string,
    pickupDate: b.pickupDate as string,
    note: typeof b.note === "string" ? (b.note as string) : undefined,
    tipAmount:
      typeof b.tipAmount === "number" && b.tipAmount > 0
        ? Math.floor(b.tipAmount)
        : 0,
    items,
  };
}

function getLeadDaysForItem(it: CheckoutItem): number {
  const p = PRODUCTS.find((pp) => pp.id === it.productId);
  if (!p) return 0;
  const v = p.variants?.find((vv) => vv.id === it.variantId);
  // prefer variant leadDays, otherwise any variant’s, otherwise 0
  return v?.leadDays ?? p.variants?.[0]?.leadDays ?? 0;
}

export async function POST(req: NextRequest) {
  // --- parse & validate body ---
  const parsed = parseBody(await req.json());
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
  const { email, customerName, items, pickupDate, note, tipAmount } = parsed;

  if (!items.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // --- date guards: valid, lead time, capacity, max days ahead ---
  const chosen = new Date(pickupDate);
  if (Number.isNaN(chosen.getTime())) {
    return NextResponse.json(
      { error: "Please choose a valid pickup date." },
      { status: 400 }
    );
  }

  // enforce max days ahead (uses imported MAX_DAYS_AHEAD to satisfy ESLint unused rule)
  const latest = new Date();
  latest.setDate(latest.getDate() + MAX_DAYS_AHEAD);
  if (chosen > endOfDay(latest)) {
    return NextResponse.json(
      { error: `Please choose a date within ${MAX_DAYS_AHEAD} days.` },
      { status: 400 }
    );
  }

  const maxLead = Math.max(0, ...items.map(getLeadDaysForItem));
  const earliest = new Date();
  earliest.setDate(earliest.getDate() + maxLead);
  if (chosen < startOfDay(earliest)) {
    return NextResponse.json(
      {
        error: `Earliest available pickup is ${earliest.toLocaleDateString()}.`,
      },
      { status: 400 }
    );
  }

  const countForDay = await prisma.order.count({
    where: {
      pickupDate: { gte: startOfDay(chosen), lte: endOfDay(chosen) },
      status: { in: ["paid", "preparing", "ready"] },
    },
  });
  if (countForDay >= CAPACITY_PER_DAY) {
    return NextResponse.json(
      {
        error:
          "We’re fully booked for that day. Please choose another date.",
      },
      { status: 400 }
    );
  }

  // --- build Stripe line items (pickup only; no delivery fee) ---
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const it of items) {
    const p = PRODUCTS.find((pp) => pp.id === it.productId);
    if (!p) {
      return NextResponse.json(
        { error: "One of your items is not available anymore." },
        { status: 400 }
      );
    }
    const v = p.variants?.find((vv) => vv.id === it.variantId);
    const unit = v?.price ?? p.basePrice ?? 0;
    if (!unit) {
      return NextResponse.json(
        { error: "Pricing missing for one of your items." },
        { status: 400 }
      );
    }
    line_items.push({
      quantity: it.quantity,
      price_data: {
        currency: "usd",
        unit_amount: unit,
        product_data: {
          name: `${p.name}${v ? ` — ${v.name}` : ""}`,
        },
      },
    });
  }

  if (tipAmount && tipAmount > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: tipAmount,
        product_data: { name: "Tip" },
      },
    });
  }

  const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    line_items,
    success_url: `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
    metadata: {
      customerName,
      pickupDate, // YYYY-MM-DD
      note: note ?? "",
      fulfillmentType: "pickup", // for completeness
    },
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
