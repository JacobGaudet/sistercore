import "./globals.css";
import { CartProvider } from "./cart/CartContext";
import Header from "./components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <div className="page">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
