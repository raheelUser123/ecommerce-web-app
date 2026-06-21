"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Trash2, Tag } from "lucide-react";

export default function CartClient() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  function saveCart(items: any[]) {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  }

  function removeItem(id: string, variationId: string | null) {
    saveCart(cartItems.filter((item) => !(item.id === id && item.variation_id === variationId)));
  }

  function updateQty(id: string, variationId: string | null, qty: number) {
    if (qty < 1) return;
    saveCart(
      cartItems.map((item) =>
        item.id === id && item.variation_id === variationId
          ? { ...item, quantity: qty }
          : item
      )
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-zinc-200 pb-6">
        <h1 className="text-4xl font-extrabold text-dark tracking-tight">Shopping Bag</h1>
        <p className="text-muted text-sm mt-1">Review your items before checking out</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="card py-16 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Cart is empty</h2>
          <Link href="/shop" className="btn btn-primary">Go to Shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.variation_id}`} className="card p-5 flex flex-col sm:flex-row items-center gap-5 justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl border" />
                  <div>
                    <h3 className="font-bold text-dark">{item.title}</h3>
                    <p className="text-xs text-primary font-bold">{item.variant}</p>
                    <p className="text-sm font-bold">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex items-center border rounded-lg h-9">
                    <button onClick={() => updateQty(item.id, item.variation_id, item.quantity - 1)} className="px-3">-</button>
                    <span className="px-2 text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.variation_id, item.quantity + 1)} className="px-3">+</button>
                  </div>

                  <p className="font-extrabold">${(item.price * item.quantity).toFixed(2)}</p>

                  <button onClick={() => removeItem(item.id, item.variation_id)} className="p-2 text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          <div className="card p-6 space-y-6">
            <h2 className="font-bold text-dark text-lg border-b pb-3.5">Order Summary</h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div>
              <div className="flex justify-between"><span>Shipping</span><b>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</b></div>
              <div className="flex justify-between"><span>Tax</span><b>${tax.toFixed(2)}</b></div>
              <div className="border-t pt-3.5 flex justify-between text-base font-extrabold">
                <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="relative">
              <input placeholder="Promo code" className="input text-xs pr-10" />
              <Tag className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
            </div>

            <Link href="/checkout" className="w-full h-12 btn btn-primary flex items-center justify-center gap-2 text-sm">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}