// lib/email.ts
import { Resend } from "resend";
import OrderConfirmationEmail from "@/app/emails/OrderConfirmationEmail";
import { buildPickupIcs } from "@/lib/ics";

/**
 * ENV expected:
 *  - RESEND_API_KEY
 *  - FROM_EMAIL           e.g.  "Sister Core ATX <orders@sistercoreatx.com>"
 *  - OWNER_EMAIL          (seller alerts; can be a Gmail)
 */
const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.FROM_EMAIL;
const OWNER = process.env.OWNER_EMAIL || FROM;

const emailEnabled = !!RESEND_KEY && !!FROM;
const resend = emailEnabled ? new Resend(RESEND_KEY) : null;

type StripeLine = {
  description?: string | null;
  quantity?: number | null;
  amount_total?: number | null; // cents
};

export async function sendOrderEmails({
  customerEmail,
  customerName,
  pickupDateISO,
  fulfillmentType,
  deliveryZip,
  note,
  lineItems,
  subtotal,
  tip,
  total,
}: {
  customerEmail: string;
  customerName: string;
  pickupDateISO: string; // "YYYY-MM-DD"
  fulfillmentType: "pickup" | "delivery";
  deliveryZip?: string | null;
  note?: string | null;
  lineItems: StripeLine[];
  subtotal: number; // cents
  tip: number; // cents
  total: number; // cents
}) {
  // If email isn't configured, don't crash the app/webhook—just log.
  if (!emailEnabled || !resend) {
    console.log("[email] disabled; would send:", {
      toCustomer: customerEmail,
      toOwner: OWNER,
      pickupDateISO,
      fulfillmentType,
      subtotal,
      tip,
      total,
    });
    return;
  }

  // Normalize items (exclude fee/tip lines from the item list)
  const normalized = lineItems
    .filter((li) => {
      const d = (li.description || "").toLowerCase().trim();
      return d !== "tip" && d !== "local delivery";
    })
    .map((li) => ({
      name: li.description || "Item",
      quantity: li.quantity || 1,
      total: li.amount_total || 0,
    }));

  // Calendar attachment (nice customer experience)
  const ics = buildPickupIcs({
    summary: fulfillmentType === "pickup" ? "Sister Core Pickup" : "Sister Core Delivery",
    description: `Order for ${customerName}${note ? ` — ${note}` : ""}`,
    dateISO: pickupDateISO,
    location: fulfillmentType === "pickup" ? "Sister Core ATX" : `Delivery ${deliveryZip ?? ""}`,
  });

  // Send customer confirmation
  try {
    await resend.emails.send({
      from: FROM!,
      to: customerEmail,
      replyTo: OWNER, // customer replies go to you
      subject: `Your order is confirmed — ${new Date(pickupDateISO).toLocaleDateString()}`,
      react: OrderConfirmationEmail({
        customerName,
        pickupDateISO,
        fulfillmentType,
        deliveryZip,
        note,
        lines: normalized,
        subtotal,
        tip,
        total,
      }),
      attachments: [
        {
          filename: "pickup.ics",
          content: Buffer.from(ics).toString("base64"),
          contentType: "text/calendar",
        },
      ],
    });
  } catch (err) {
    console.error("[email] customer send failed:", err);
    // continue so seller alert still goes out
  }

  // Send seller alert
  try {
    await resend.emails.send({
      from: FROM!,
      to: OWNER!, // your inbox (Gmail OK)
      replyTo: customerEmail, // reply lands with the customer
      subject: `🧁 New ${fulfillmentType} order — ${customerName} (${new Date(
        pickupDateISO
      ).toLocaleDateString()})`,
      text: [
        `Name: ${customerName}`,
        `Email: ${customerEmail}`,
        `When: ${pickupDateISO}`,
        `Fulfillment: ${fulfillmentType}${deliveryZip ? ` (ZIP ${deliveryZip})` : ""}`,
        `Note: ${note ?? "-"}`,
        "",
        "Items:",
        ...normalized.map(
          (l) => `  • ${l.name} × ${l.quantity} — $${(l.total / 100).toFixed(2)}`
        ),
        "",
        `Subtotal: $${(subtotal / 100).toFixed(2)}`,
        tip ? `Tip: $${(tip / 100).toFixed(2)}` : "",
        `Total: $${(total / 100).toFixed(2)}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[email] seller alert failed:", err);
  }
}

// (optional) export flag if you want to conditionally show UI based on email availability
export const EMAIL_CONFIGURED = emailEnabled;
