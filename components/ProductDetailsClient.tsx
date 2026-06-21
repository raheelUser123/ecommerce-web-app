"use client";

import Link from "next/link";
import { useState } from "react";
import { createReview } from "@/app/actions/review";
import {
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  ShoppingCart,
  Check,
  Minus,
  Plus,
} from "lucide-react";

export default function ProductDetailsClient({ product }: { product: any }) {
  const variations = product.product_variations || [];
  const gallery = product.product_gallery || [];
  const reviews = (product.reviews || []).filter((r: any) => r.status === "approved");

  const [selectedVariation, setSelectedVariation] = useState<any>(
    variations[0] || null
  );

  const [mainImage, setMainImage] = useState(
    selectedVariation?.image || product.main_image || "/placeholder.png"
  );

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const price = Number(selectedVariation?.price || product.price || 0);
  const stock = Number(selectedVariation?.stock || 0);
  const inStock = selectedVariation ? stock > 0 : true;
  const totalReviews = reviews.length;

  function selectVariation(v: any) {
    setSelectedVariation(v);

    if (v.image) {
      setMainImage(v.image);
    }
  }

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const item = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price,
      image: mainImage,
      variant: selectedVariation
        ? `${selectedVariation.name}: ${selectedVariation.value}`
        : "Default",
      variation_id: selectedVariation?.id || null,
      quantity,
    };

    const existing = cart.find(
      (x: any) => x.id === item.id && x.variation_id === item.variation_id
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    alert("Product added to cart");
  }

  const galleryImages = Array.from(
  new Set([
    product.main_image,
    ...(product.product_gallery || []).map((g: any) => g.image),
    ...(product.product_variations || []).map((v: any) => v.image),
  ].filter(Boolean))
);

  return (
    <div className="space-y-16 pb-12">
      <div className="flex items-center gap-2 text-xs text-muted font-medium">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <span>/</span>
        <span className="text-dark font-semibold">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-200 aspect-square">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {galleryImages.length > 0 && (
  <div className="grid grid-cols-5 gap-3">
    {galleryImages.map((img: string, index: number) => (
      <button
        key={`${img}-${index}`}
        type="button"
        onClick={() => setMainImage(img)}
        className={`rounded-xl overflow-hidden bg-zinc-50 border aspect-square ${
          mainImage === img
            ? "border-primary ring-2 ring-primary/20"
            : "border-zinc-200"
        }`}
      >
        <img
          src={img}
          alt="Product gallery"
          className="w-full h-full object-cover"
        />
      </button>
    ))}
  </div>
)}
        </div>

        <div className="card p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <span
                className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                  inStock
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-rose-50 text-rose-600 border border-rose-200"
                }`}
              >
                {inStock ? `In Stock ${stock ? `(${stock})` : ""}` : "Out of Stock"}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-muted">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-dark">
                  ({totalReviews} Reviews)
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-dark tracking-tight">
                {product.title}
              </h1>
              <p className="text-3xl font-extrabold text-primary mt-3">
                ${price.toFixed(2)}
              </p>
            </div>

            <p className="text-muted text-sm leading-relaxed border-b border-zinc-100 pb-5">
              {product.description}
            </p>

            {variations.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-dark text-xs uppercase tracking-wider">
                  Select Variant
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {variations.map((v: any) => {
                    const isActive = selectedVariation?.id === v.id;

                    return (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => selectVariation(v)}
                        className={`border rounded-xl py-3 px-4 flex items-center gap-3 transition-all ${
                          isActive
                            ? "border-primary bg-primary-light text-primary font-bold shadow-sm"
                            : "border-zinc-200 hover:border-primary text-dark/80"
                        }`}
                      >
                        {isActive && <Check className="w-3.5 h-3.5" />}
                        <span className="text-xs">
                          {v.name}: {v.value}
                        </span>
                        <span className="text-xs font-bold">
                          ${Number(v.price).toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-bold text-dark text-xs uppercase tracking-wider">
                Quantity
              </h3>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 h-full hover:bg-zinc-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="px-5 font-bold">{quantity}</span>

                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 h-full hover:bg-zinc-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!inStock}
                  className="flex-1 h-12 btn btn-primary justify-center disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 pt-6 text-center">
              <div>
                <Truck className="w-5 h-5 mx-auto text-primary" />
                <p className="text-[10px] font-bold">Express Ship</p>
              </div>
              <div>
                <ShieldCheck className="w-5 h-5 mx-auto text-primary" />
                <p className="text-[10px] font-bold">Secure Stripe</p>
              </div>
              <div>
                <RefreshCw className="w-5 h-5 mx-auto text-primary" />
                <p className="text-[10px] font-bold">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="card p-0 overflow-hidden">
        <div className="flex flex-wrap border-b border-zinc-200">
          {["description", "size", "shipping", "reviews"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold capitalize ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary bg-primary-light"
                  : "text-muted hover:text-dark"
              }`}
            >
              {tab === "shipping" ? "Shipping Policy" : tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-dark">Product Description</h2>
              <p className="text-muted text-sm leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>
          )}

          {activeTab === "size" && (
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-dark">Size Guide</h2>
              <p className="text-muted text-sm">
                Please check the selected variation before purchase. Sizes may vary by product type.
              </p>

              <div className="overflow-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="p-3 text-left border">Variant</th>
                      <th className="p-3 text-left border">Price</th>
                      <th className="p-3 text-left border">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variations.map((v: any) => (
                      <tr key={v.id}>
                        <td className="p-3 border">{v.name}: {v.value}</td>
                        <td className="p-3 border">${Number(v.price).toFixed(2)}</td>
                        <td className="p-3 border">{v.stock || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-dark">Shipping Policy</h2>
              <p className="text-muted text-sm leading-relaxed">
                Orders are processed within 1–3 business days. Delivery time depends on your location.
                Free shipping may apply on eligible orders. Return requests are accepted within 30 days
                if the product is unused and in original packaging.
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-dark">
                Customer Reviews ({totalReviews})
              </h2>
<form action={createReview} className="border border-zinc-200 rounded-xl p-5 space-y-4">
  <input type="hidden" name="product_id" value={product.id} />
  <input type="hidden" name="product_slug" value={product.slug} />

  <h3 className="font-bold text-dark">Write a Review</h3>

  <input name="customer_name" required placeholder="Your name" className="input" />
  <input name="customer_email" type="email" placeholder="Your email" className="input" />

  <select name="rating" className="input" defaultValue="5">
    <option value="5">5 Stars</option>
    <option value="4">4 Stars</option>
    <option value="3">3 Stars</option>
    <option value="2">2 Stars</option>
    <option value="1">1 Star</option>
  </select>

  <textarea name="review" required rows={4} placeholder="Write your review..." className="input" />

  <button type="submit" className="btn btn-primary">
    Submit Review
  </button>
</form>
              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="border border-zinc-200 rounded-xl p-5 space-y-3">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating ? "fill-current" : "opacity-30"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted text-xs italic">"{r.review}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No reviews yet.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}