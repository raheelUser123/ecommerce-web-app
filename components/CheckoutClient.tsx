"use client";

import { useEffect, useState } from "react";
import { CreditCard, ShieldCheck, Mail, User, MapPin } from "lucide-react";

export default function CheckoutClient() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  async function payNow() {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Stripe checkout error");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-zinc-200 pb-6">
        <h1 className="text-4xl font-extrabold text-dark tracking-tight">Checkout</h1>
        <p className="text-muted text-sm mt-1">Complete secure checkout via Stripe</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-dark flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Shipping Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <input placeholder="First Name" className="input text-xs pl-10" />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" />
              </div>
              <div className="relative">
                <input placeholder="Last Name" className="input text-xs pl-10" />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" />
              </div>
            </div>

            <div className="relative">
              <input type="email" placeholder="Email" className="input text-xs pl-10" />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" />
            </div>

            <input placeholder="Street Address" className="input text-xs" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input placeholder="City" className="input text-xs" />
              <input placeholder="State" className="input text-xs" />
              <input placeholder="Postal Code" className="input text-xs" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-6">
            <h2 className="font-bold text-dark text-lg border-b pb-3.5">Your Order</h2>

            <div className="space-y-4 pb-4 border-b">
              {items.length > 0 ? items.map((item) => (
                <div key={`${item.id}-${item.variation_id}`} className="flex justify-between gap-4 text-xs">
                  <span>{item.title} x {item.quantity}</span>
                  <b>${(item.price * item.quantity).toFixed(2)}</b>
                </div>
              )) : (
                <p className="text-xs text-muted">Cart is empty.</p>
              )}
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div>
              <div className="flex justify-between"><span>Shipping</span><b>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</b></div>
              <div className="flex justify-between"><span>Tax</span><b>${tax.toFixed(2)}</b></div>
              <div className="border-t pt-3.5 flex justify-between text-base font-extrabold">
                <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={payNow}
              disabled={items.length === 0 || loading}
              className="w-full h-12 btn btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? "Redirecting..." : "Pay Securely via Stripe"}
            </button>
          </div>

          <div className="card p-6 bg-zinc-50">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
              <ShieldCheck className="w-5 h-5" /> 256-Bit SSL Encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}