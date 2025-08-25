import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Section,
} from "@react-email/components";

export type Line = { name: string; quantity: number; total: number };

export default function OrderConfirmationEmail({
  customerName,
  pickupDateISO,
  fulfillmentType,
  deliveryZip,
  note,
  lines,
  subtotal,
  tip,
  total,
}: {
  customerName: string;
  pickupDateISO: string; // YYYY-MM-DD
  fulfillmentType: "pickup" | "delivery";
  deliveryZip?: string | null;
  note?: string | null;
  lines: Line[];
  subtotal: number; // cents
  tip: number;      // cents
  total: number;    // cents
}) {
  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;
  const date = new Date(pickupDateISO + "T12:00:00Z").toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <Html>
      <Head />
      <Preview>Your Sister Core order is confirmed for {date}</Preview>
      <Body
        style={{
          backgroundColor: "#f7f2f6",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
          color: "#3a2a35",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "24px auto",
            padding: 24,
            borderRadius: 16,
            maxWidth: 620,
            border: "1px solid #f0d9e6",
          }}
        >
          <Heading style={{ margin: 0, fontSize: 28 }}>
            Thanks, {customerName}! 🎉
          </Heading>
          <Text style={{ margin: "6px 0 16px 0", color: "#6d5b66" }}>
            We’ve received your order.{" "}
            <strong>
              {fulfillmentType === "pickup" ? "Pickup" : "Delivery"} on {date}
            </strong>
            {fulfillmentType === "delivery" && deliveryZip
              ? ` (ZIP ${deliveryZip})`
              : ""}
            .
          </Text>

          <Section>
            {lines.map((l, i) => (
              <Text key={i} style={{ margin: "4px 0" }}>
                {l.name} × {l.quantity} — <strong>{fmt(l.total)}</strong>
              </Text>
            ))}
          </Section>

          <Hr style={{ borderColor: "#f0d9e6", margin: "16px 0" }} />

          <Section>
            <Text style={{ margin: "2px 0" }}>
              Subtotal: <strong>{fmt(subtotal)}</strong>
            </Text>
            {tip > 0 && (
              <Text style={{ margin: "2px 0" }}>
                Tip: <strong>{fmt(tip)}</strong>
              </Text>
            )}
            <Text style={{ margin: "6px 0" }}>
              Total Paid: <strong>{fmt(total)}</strong>
            </Text>
          </Section>

          {note ? (
            <>
              <Hr style={{ borderColor: "#f0d9e6", margin: "16px 0" }} />
              <Text style={{ color: "#6d5b66" }}>
                <strong>Note:</strong> {note}
              </Text>
            </>
          ) : null}

          <Hr style={{ borderColor: "#f0d9e6", margin: "16px 0" }} />

          <Text style={{ color: "#9a8a94", fontSize: 12 }}>
            You’ll receive another email if anything changes. Reply to this
            email with any questions.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
