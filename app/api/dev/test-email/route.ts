import { NextResponse } from "next/server";
import { sendOrderEmails } from "@/lib/email";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Disabled in production", { status: 403 });
  }
  const today = new Date();
  const dateISO = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    .toISOString().slice(0, 10);

  await sendOrderEmails({
    customerEmail: process.env.OWNER_EMAIL!,   // send to you for testing
    customerName: "Test Customer",
    pickupDateISO: dateISO,
    fulfillmentType: "pickup",
    deliveryZip: null,
    note: "Test email from dev endpoint",
    lineItems: [{ description: "Cupcakes — 6-Pack", quantity: 1, amount_total: 1500 }],
    subtotal: 1500,
    tip: 0,
    total: 1500,
  });

  return NextResponse.json({ ok: true });
}
