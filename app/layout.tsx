import "./globals.css";
import { CartProvider } from "./cart/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ToastProvider";
import LogoBanner from "./components/LogoBanner";  // ⬅️ add
import { Inter } from "next/font/google";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Sister Core",
  description: "Fresh baked treats, mystery books, and cozy vibes.",
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <CartProvider>
          <ToastProvider>
            <Header />
            <LogoBanner /> {/* ⬅️ logo shown on all pages */}
            <div className="page">{children}</div>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
