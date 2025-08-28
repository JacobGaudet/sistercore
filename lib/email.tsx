// lib/email.ts
import { Resend } from "resend";
import { render } from "@react-email/render";          // ⬅️ new
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

  const ics = buildPickupIcs({
    summary: fulfillmentType === "pickup" ? "Sister Core Pickup" : "Sister Core Delivery",
    description: `Order for ${customerName}${note ? ` — ${note}` : ""}`,
    dateISO: pickupDateISO,
    location: fulfillmentType === "pickup" ? "Sister Core ATX" : `Delivery ${deliveryZip ?? ""}`,
  });

  // ——— Customer confirmation ———
  const customerSubject = `Your order is confirmed — ${new Date(pickupDateISO).toLocaleDateString()}`;

  // ——— Customer confirmation ———
try {
  const html = await render(
    <OrderConfirmationEmail
      customerName={customerName}
      pickupDateISO={pickupDateISO}
      fulfillmentType={fulfillmentType}
      deliveryZip={deliveryZip}
      note={note}
      lines={normalized}
      subtotal={subtotal}
      tip={tip}
      total={total}
    />
  );

  await resend.emails.send({
    from: FROM!,
    to: customerEmail,
    replyTo: OWNER,
    subject: `📅✅ Your order is confirmed — ${new Date(pickupDateISO).toLocaleDateString()}`,
    html,
    attachments: [
      { filename: "pickup.ics", content: Buffer.from(ics).toString("base64") },
    ],
  });
} catch (err) {
    // Text fallback so customers still get a confirmation
    const text = [
      `Hi ${customerName || "there"},`,
      ``,
      `Thanks for your order!`,
      `Pickup date: ${pickupDateISO}`,
      note ? `Note: ${note}` : "",
      ``,
      `Items:`,
      ...normalized.map((l) => `• ${l.name} × ${l.quantity}`),
      ``,
      `Total: $${(total / 100).toFixed(2)}`,
      `— Sister Core ATX`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await resend.emails.send({
        from: FROM!,
        to: customerEmail,
        replyTo: OWNER,
        subject: customerSubject,
        text,
        attachments: [
          { filename: "pickup.ics", content: Buffer.from(ics).toString("base64") },
        ],
      });
    } catch (err2) {
      console.error("[email] customer text fallback failed:", err2);
    }
  }

  // ——— Seller alert ———
  try {
    await resend.emails.send({
      from: FROM!,
      to: OWNER!, // your inbox
      replyTo: customerEmail,
      subject: `📩 New ${fulfillmentType} order — ${customerName} (${new Date(
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

export const EMAIL_CONFIGURED = emailEnabled;
