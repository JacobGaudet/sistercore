import Link from "next/link";
export default function ThankYou() {
  return (
    <main className="container">
      <div className="card stack">
        <h1>Thank you! 🎉</h1>
        <p className="lead">We’ve received your order. A confirmation email will arrive shortly.</p>
        <p className="lead">(Check your spam if you don’t see it right away!)</p>
        <Link href="/" className="btn">Back to home</Link>
      </div>
    </main>
  );
}
