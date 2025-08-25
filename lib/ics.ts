/**
 * Builds a simple single-event ICS string for pickup/delivery reminders.
 * Attach the returned string as base64 to an email with contentType "text/calendar".
 */
export function buildPickupIcs({
  summary,
  description,
  dateISO, // e.g. "2025-08-20"
  durationMinutes = 30,
  location = "Sister Core ATX",
}: {
  summary: string;
  description?: string;
  dateISO: string;
  durationMinutes?: number;
  location?: string;
}) {
  // Put the event at noon local time for that date to avoid time zone ambiguity for all-day-ish events
  const startLocal = new Date(dateISO);
  startLocal.setHours(12, 0, 0, 0);
  const endLocal = new Date(startLocal.getTime() + durationMinutes * 60 * 1000);

  const fmtUTC = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; // YYYYMMDDTHHMMSSZ

  const escape = (s: string) =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");

  const now = new Date();

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sister Core ATX//Orders//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${"sistercore-" + fmtUTC(startLocal)}@sistercoreatx.com`,
    `DTSTAMP:${fmtUTC(now)}`,
    `DTSTART:${fmtUTC(startLocal)}`,
    `DTEND:${fmtUTC(endLocal)}`,
    `SUMMARY:${escape(summary)}`,
    `DESCRIPTION:${escape(description || "")}`,
    `LOCATION:${escape(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return ics;
}
