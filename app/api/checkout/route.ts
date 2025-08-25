import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { CAPACITY_PER_DAY, MAX_DAYS_AHEAD, startOfDay, endOfDay } from "@/lib/order-policy";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, customerName, pickupDate, note, items } = body; // <-- no fulfillmentType, no deliveryZip

  // basic validations…
  const chosen = new Date(pickupDate);
  if (Number.isNaN(chosen.getTime())) {
    return NextResponse.json({ error: "Please choose a valid pickup date." }, { status: 400 });
  }

  // Lead time: compute max leadDays from selected items
  const maxLead = Math.max(
    0,
    ...items.map((it: any) => {
      const p = PRODUCTS.find(p => p.id === it.productId);
      const v = p?.variants?.find(v => v.id === it.variantId);
      return v?.leadDays ?? p?.variants?.[0]?.leadDays ?? 0;
    })
  );
  const earliest = new Date(); earliest.setDate(earliest.getDate() + maxLead);
  if (chosen < startOfDay(earliest)) {
    return NextResponse.json({ error: `Earliest available pickup is ${earliest.toLocaleDateString()}.` }, { status: 400 });
  }

  // Capacity
  const existing = await prisma.order.count({
    where: {
      pickupDate: { gte: startOfDay(chosen), lte: endOfDay(chosen) },
      status: { in: ["paid", "preparing", "ready"] },
    },
  });
  if (existing >= CAPACITY_PER_DAY) {
    return NextResponse.json({ error: "We’re fully booked for that day. Please choose another date." }, { status: 400 });
  }

  // Stripe line items from cart
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((it: any) => {
    const product = PRODUCTS.find(p => p.id === it.productId)!;
    const variant = product.variants?.find(v => v.id === it.variantId)!;
    const price = variant?.price ?? product.basePrice ?? 0;

    return {
      quantity: it.quantity,
      price_data: {
        currency: "usd",
        unit_amount: price,
        product_data: {
          name: `${product.name}${variant ? ` — ${variant.name}` : ""}`,
        },
      },
    };
  });

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
      note: note || "",
      // fulfillmentType: "pickup" // (optional) you can include this if you wish
    },
  });

  return NextResponse.json({ id: session.id, url: session.url });
}
