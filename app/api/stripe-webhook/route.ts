import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderEmails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // ensure raw body reaches us in prod

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing stripe-signature", { status: 400 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ Invalid Stripe signature:", msg);
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
  }

  // We care about completed checkouts (sync or async)
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Pull line items for the email & DB
      const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

      // Totals (cents)
      const total = li.data.reduce((sum, x) => sum + (x.amount_total ?? 0), 0);
      const tipItem = li.data.find(x => (x.description || "").trim().toLowerCase() === "tip");
      const tip = tipItem?.amount_total ?? 0;
      const subtotal = total - tip;

      const meta = session.metadata ?? {};
      const email = session.customer_details?.email || session.customer_email || meta.email || "";
      const customerName = (session.customer_details?.name || meta.customerName || "").trim();
      const pickupDateISO = (meta.pickupDate || "") as string;
      const note = (meta.note || "") as string;

      // Store order (optional but you already have it)
      await prisma.order.create({
        data: {
          email,
          customerName,
          status: "paid",
          totalAmount: total,
          stripeSessionId: session.id,
          pickupDate: pickupDateISO ? new Date(pickupDateISO) : new Date(),
          fulfillmentType: "pickup",
          deliveryZip: null,
          note: note || null,
          tipAmount: tip,
          items: {
            create: li.data
              .filter(x => (x.description || "").trim().toLowerCase() !== "tip")
              .map(x => ({
                productId: "catalog",
                variantId: null,
                quantity: x.quantity ?? 1,
                unitPrice:
                  (x.amount_total ?? 0) / Math.max(1, x.quantity ?? 1),
              })),
          },
        },
      });

      // Send BOTH emails
      await sendOrderEmails({
        customerEmail: email,
        customerName,
        pickupDateISO,
        fulfillmentType: "pickup",
        deliveryZip: null,
        note,
        lineItems: li.data.map(x => ({
          description: x.description,
          quantity: x.quantity,
          amount_total: x.amount_total,
        })),
        subtotal,
        tip,
        total,
      });

      console.log("✅ Webhook handled for", session.id, "email:", email);
    } catch (e) {
      console.error("❌ Webhook handling failed:", e);
      // Return 200 so Stripe doesn’t retry forever if it’s our send failing.
      return NextResponse.json({ ok: true });
    }
  }

  return NextResponse.json({ received: true });
}
