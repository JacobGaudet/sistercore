import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS } from "@/lib/products";
import { isZipDeliverable, deliveryFeeCents } from "@/lib/delivery";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Item = { productId: string; variantId?: string; name: string; variantLabel?: string; unitAmount: number; quantity: number };

function enforceLeadTimes(items: Item[], pickupDateISO: string) {
  const date = new Date(pickupDateISO);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid pickup/delivery date");

  for (const it of items) {
    const p = PRODUCTS.find(p => p.id === it.productId);
    const v = p?.variants?.find(v => v.id === it.variantId);
    const lead = v?.leadDays ?? 0;
    const earliest = new Date();
    earliest.setHours(0,0,0,0);
    earliest.setDate(earliest.getDate() + lead);
    if (date < earliest) throw new Error(`Selected date too soon for ${p?.name}${v ? ` – ${v.name}` : ""}`);
  }
}

export async function POST(req: NextRequest) {
  const { email, customerName, items, pickupDate, fulfillmentType, deliveryZip, note, tipAmount = 0 } = await req.json();

  if (!email || !customerName || !items?.length) return new NextResponse("Missing fields", { status: 400 });

  enforceLeadTimes(items, pickupDate);
  if (fulfillmentType === "delivery" && !isZipDeliverable(deliveryZip)) {
    return new NextResponse("We only deliver to select ZIP codes.", { status: 400 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((it: Item) => ({
    quantity: it.quantity,
    price_data: {
      currency: "usd",
      product_data: { name: `${it.name}${it.variantLabel ? ` – ${it.variantLabel}` : ""}` },
      unit_amount: it.unitAmount,
    },
  }));

  if (fulfillmentType === "delivery") {
    const fee = deliveryFeeCents(deliveryZip);
    if (!fee) return new NextResponse("ZIP not deliverable.", { status: 400 });
    line_items.push({
      quantity: 1,
      price_data: { currency: "usd", product_data: { name: "Local Delivery" }, unit_amount: fee },
    });
  }
  if (tipAmount > 0) {
    line_items.push({
      quantity: 1,
      price_data: { currency: "usd", product_data: { name: "Tip" }, unit_amount: tipAmount },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    line_items,
    success_url: `${process.env.PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PUBLIC_BASE_URL}/cart`,
    metadata: { customerName, pickupDate, fulfillmentType, deliveryZip: deliveryZip || "", note: note || "" },
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
