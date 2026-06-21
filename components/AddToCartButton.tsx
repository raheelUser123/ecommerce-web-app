"use client";

import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const variation = product.product_variations?.[0];

    const item = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: Number(variation?.price || product.price || 0),
      image: product.main_image || "/placeholder.png",
      variant: variation ? `${variation.name}: ${variation.value}` : "Default",
      variation_id: variation?.id || null,
      quantity: 1,
    };

    const existing = cart.find(
      (x: any) => x.id === item.id && x.variation_id === item.variation_id
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
  }

  return (
    <button
      type="button"
      onClick={addToCart}
      className="w-full h-12 btn btn-primary flex items-center justify-center gap-2 text-sm shadow-md"
    >
      <ShoppingCart className="w-4 h-4" /> Add to Shopping Cart
    </button>
  );
}