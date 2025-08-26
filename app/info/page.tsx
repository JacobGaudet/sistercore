import ConfirmEmailLink from "@/app/components/ConfirmEmailLink";

export const metadata = {
  title: "About & Policies — Sister Core ATX",
  description: "Pickup-only bakery in Austin, TX. Lead times, allergens, and order policies.",
};

export default function InfoPage() {
  return (
    <main className="container stack">
      <section className="card stack">
        <h1>About Sister Core</h1>
        <p className="lead">
          Our business is rooted in what we love to do as sisters - and who we are at our core.
           As healthcare workers, we're passionate about a healthier, more holistic, and cozy approach to life.
            Some of our favorite ways to live this out are baking from scratch, reading real (paper!) books, and crating joy in everything we do.
        </p>
        <p className="lead">
          Questions? Email <ConfirmEmailLink label="orders@sistercoreatx.com" variant="link" /> or
          say hi on Instagram:{" "}
          <a href="https://instagram.com/sistercore.atx" target="_blank" rel="noopener noreferrer">
            @sistercore.atx
          </a>
        </p>
      </section>

      <section className="grid grid-2">
        <div className="card stack">
          <h2>Pickup</h2>
          <p className="lead">
            Choose your pickup date at checkout. We’ll email a confirmation with an optional calendar attachment.
          </p>
          <p className="lead">
            If you need to adjust your pickup time, reply to your order email—we’ll do our best to help.
          </p>
        </div>

        <div className="card stack">
          <h2>Lead Times</h2>
          <p className="lead">
            Lead time varies by item and is shown on each product (e.g., 3 days). The cart will prevent
            choosing a date earlier than we can accommodate.
          </p>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="card stack">
          <h2>Allergens</h2>
          <p className="lead">
            Our kitchen handles wheat, dairy, eggs, and nuts. We cannot guarantee allergen-free bakes.
            Please include any allergy notes at checkout.
          </p>
        </div>

        <div className="card stack">
          <h2>Cancellations & Refunds</h2>
          <p className="lead">
            Full refunds are available up to 48 hours before your pickup date. Within 48 hours,
            ingredients are already underway—please email us and we’ll work with you on options.
          </p>
        </div>
      </section>

      <section className="card stack">
        <h2>Contact</h2>
        <p className="lead">
          Email: <ConfirmEmailLink label="orders@sistercoreatx.com" variant="link" /><br />
          Instagram:{" "}
          <a href="https://instagram.com/sistercore.atx" target="_blank" rel="noopener noreferrer">
            @sistercore.atx
          </a>
        </p>
      </section>
    </main>
  );
}
