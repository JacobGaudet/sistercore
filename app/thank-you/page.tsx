import Link from "next/link";
export default function ThankYou() {
  return (
    <main className="container">
      <div className="card stack">
        <h1>Thank you! 🎉</h1>
        <p className="lead">We’ve received your order. A confirmation will arrive shortly.</p>
        <Link href="/" className="btn">Back to home</Link>
      </div>
    </main>
  );
}
