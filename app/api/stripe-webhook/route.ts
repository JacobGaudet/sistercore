import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const raw = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { customerName, pickupDate, fulfillmentType, deliveryZip, note } = session.metadata ?? {};
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const total = lineItems.data.reduce((sum, li) => sum + (li.amount_total ?? 0), 0);
    const tipItem = lineItems.data.find(li => li.description?.toLowerCase() === "tip");
    const tipAmount = tipItem?.amount_total ?? 0;

    await prisma.order.create({
      data: {
        email: session.customer_details?.email || session.customer_email || "",
        customerName: customerName || "",
        status: "paid",
        totalAmount: total,
        stripeSessionId: session.id,
        pickupDate: new Date(pickupDate!),
        fulfillmentType: fulfillmentType || "pickup",
        deliveryZip: deliveryZip || null,
        note: note || null,
        tipAmount,
        items: {
          create: lineItems.data
            .filter(li => !["tip", "local delivery"].includes(li.description?.toLowerCase() || ""))
            .map(li => ({
              productId: "catalog",
              variantId: null,
              quantity: li.quantity ?? 1,
              unitPrice: (li.amount_total ?? 0) / (li.quantity || 1),
            })),
        },
      },
    });
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } } as any;
