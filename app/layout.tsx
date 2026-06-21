import "./globals.css";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { ShoppingBag, Search, User, Mail } from "lucide-react";
import HeaderCartIcon from "@/components/HeaderCartIcon";
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "OrangeStore - Modern Premium Shop",
  description: "Next.js & Supabase Custom E-commerce Store with Stripe integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // LAYOUT.TSX
    <html lang="en" className={outfit.className}>
      <body className="bg-white min-h-screen flex flex-col">
        <div className="bg-dark text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
          ⚡ FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE $100! USE CODE{" "}
          <span className="text-primary font-bold">ORANGE50</span>
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
            <Link href="/" className="font-extrabold text-2xl tracking-tight text-dark flex items-center gap-1 hover:opacity-90">
              ORANGE<span className="text-primary">STORE</span>
              <span className="text-primary font-black text-3xl leading-none">.</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-dark/80">
              <Link href="/" className="hover:text-primary transition-colors py-2">Home</Link>
              <Link href="/shop" className="hover:text-primary transition-colors py-2">Shop Catalog</Link>
              <Link href="/cart" className="hover:text-primary transition-colors py-2">Shopping Cart</Link>
              {/* <Link href="/admin" className="hover:text-primary transition-colors py-2">Admin Area</Link> */}
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-light-gray text-xs rounded-full py-2.5 pl-10 pr-4 w-60 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              </div>

              <HeaderCartIcon />

              <Link href="/admin" className="p-2.5 text-dark hover:text-primary hover:bg-primary-light rounded-full transition-all">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 animate-slideup">
          {children}
        </main>

        <footer className="bg-dark text-white pt-16 pb-8 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-zinc-800">
            <div className="space-y-4">
              <h3 className="font-extrabold text-xl tracking-tight text-white">
                ORANGE<span className="text-primary">STORE</span>
                <span className="text-primary font-black text-2xl">.</span>
              </h3>
              <p className="text-muted text-sm leading-relaxed max-w-xs">
                Premium customized WooCommerce style store with high performance category indexing,
                interactive variation controls, and Stripe payments.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-5">Shop Catalog</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li><Link href="/shop" className="hover:text-primary transition-colors">Clothing & Apparel</Link></li>
                <li><Link href="/shop" className="hover:text-primary transition-colors">Kids Wear</Link></li>
                <li><Link href="/shop" className="hover:text-primary transition-colors">Footwear Collection</Link></li>
                <li><Link href="/shop" className="hover:text-primary transition-colors">Special Variations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-5">Customer Care</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li><Link href="/cart" className="hover:text-primary transition-colors">Your Shopping Cart</Link></li>
                <li><Link href="/admin" className="hover:text-primary transition-colors">Merchant Dashboard</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Shipping & Returns Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Secure Checkout Info</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-5">Join Our Club</h4>
              <p className="text-muted text-xs mb-4">
                Subscribe to receive drop alerts, discount coupons, and store updates!
              </p>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-zinc-900 border border-zinc-800 text-sm rounded-xl py-3 pl-4 pr-10 text-white focus:outline-none focus:border-primary"
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                </div>
                <button type="button" className="w-full btn btn-primary text-xs py-3 justify-center">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
            <p>© {new Date().getFullYear()} OrangeStore. All rights reserved. Designed for excellence.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Secure Payment by Stripe</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}