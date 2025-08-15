import Link from "next/link";

export default function Home() {
  return (
    <main className="container stack">
      <section
        className="card"
        style={{ background: `linear-gradient(135deg, rgba(232,90,165,.12), rgba(179,136,235,.10)), #fff` }}
      >
        <h1>Sister-Made Books and Bakes</h1>
        <p className="lead">Sweet treats, cozy vibes. Pickup or local delivery in atx.</p>
        <div style={{ marginTop: 12 }}>
          <Link href="/menu" className="btn btn-primary">Start an Order</Link>
        </div>
      </section>
    </main>
  );
}
