import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderEmails } from "@/lib/email";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { customerName, pickupDate, note } = session.metadata ?? {};

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const total = lineItems.data.reduce((sum, li) => sum + (li.amount_total ?? 0), 0);
    const tipItem = lineItems.data.find(li => (li.description ?? "").toLowerCase().trim() === "tip");
    const tipAmount = tipItem?.amount_total ?? 0;
    const subtotal = total - tipAmount;

    const created = await prisma.order.create({
      data: {
        email: session.customer_details?.email || session.customer_email || "",
        customerName: customerName || "",
        status: "paid",
        totalAmount: total,
        stripeSessionId: session.id,
        pickupDate: new Date(pickupDate!),
        fulfillmentType: "pickup",   // <— force pickup
        deliveryZip: null,           // <— ensure null
        note: note || null,
        tipAmount: tipAmount,
        items: {
          create: lineItems.data
            .filter(li => {
              const d = (li.description || "").toLowerCase().trim();
              return d !== "tip"; // no delivery fee to filter anymore
            })
            .map(li => ({
              productId: "catalog",
              variantId: null,
              quantity: li.quantity ?? 1,
              unitPrice: (li.amount_total ?? 0) / (li.quantity || 1),
            })),
        },
      },
    });

    await sendOrderEmails({
      customerEmail: created.email,
      customerName: created.customerName,
      pickupDateISO: new Date(created.pickupDate).toISOString().slice(0, 10),
      fulfillmentType: "pickup",   // <— always pickup
      deliveryZip: null,
      note: created.note,
      lineItems: lineItems.data.map(li => ({
        description: li.description,
        quantity: li.quantity,
        amount_total: li.amount_total,
      })),
      subtotal,
      tip: tipAmount,
      total,
    });
  }

  return NextResponse.json({ received: true });
}
