"use client";

import { createProduct } from "@/app/actions/admin";
import { useState } from "react";

export default function NewProductForm({ categories }: { categories: any[] }) {
  const [variations, setVariations] = useState([1]);

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-3xl font-extrabold text-dark">Add New Product</h1>
        <p className="text-muted text-sm mt-1">
          Add product, category, images, gallery and variations.
        </p>
      </div>

      <form action={createProduct} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-dark">Product Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase">Title</label>
              <input name="title" required className="input mt-1" />
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Slug</label>
              <input name="slug" placeholder="auto generate if empty" className="input mt-1" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase">Description</label>
            <textarea name="description" rows={5} className="input mt-1" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase">Base Price</label>
              <input name="price" type="number" step="0.01" className="input mt-1" />
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Category</label>
              <select name="category_id" className="input mt-1">
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Status</label>
              <select name="status" className="input mt-1">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-dark">Images</h2>

          <div>
            <label className="text-xs font-bold uppercase">Main Image</label>
            <input type="file" name="main_image" accept="image/*" className="input mt-1" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase">Gallery Images</label>
            <input type="file" name="gallery" accept="image/*" multiple className="input mt-1" />
          </div>
        </div>

        <div className="card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark">Variations</h2>

            <button
              type="button"
              onClick={() => setVariations([...variations, Date.now()])}
              className="btn btn-outline"
            >
              + Add Variation
            </button>
          </div>

          {variations.map((id, index) => (
            <div key={id} className="border border-zinc-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-dark">Variation {index + 1}</h3>

                {variations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setVariations(variations.filter((v) => v !== id))}
                    className="text-xs font-bold text-rose-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="variation_name" placeholder="Name e.g. Size" className="input" />
                <input name="variation_value" placeholder="Value e.g. Small" className="input" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="variation_price" type="number" step="0.01" placeholder="Price" className="input" />
                <input name="variation_stock" type="number" placeholder="Stock" className="input" />
                <input name="variation_sku" placeholder="SKU" className="input" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}