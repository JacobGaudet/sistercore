import "./globals.css";
import { CartProvider } from "./cart/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ToastProvider";
import { Inter } from "next/font/google";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Sister Core ATX",
  description: "Pastel treats, mystery books, and cozy vibes in Austin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body id="top">
        <CartProvider>
          <ToastProvider>
            <Header />
            <div className="page">{children}</div>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
