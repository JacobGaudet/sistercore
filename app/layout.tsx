import "./globals.css";
import { CartProvider } from "./cart/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ToastProvider";
import { Playfair_Display, Manrope } from "next/font/google";

const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
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
