import { createProduct } from "@/app/actions/admin";
import { supabase } from "@/lib/supabase";

export default async function NewProductPage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-3xl font-extrabold text-dark">Add New Product</h1>
        <p className="text-muted text-sm mt-1">
          Product, main image, gallery and variations upload.
        </p>
      </div>

      <form action={createProduct} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-dark">Product Details</h2>

          <div>
            <label className="text-xs font-bold uppercase">Title</label>
            <input name="title" required className="input mt-1" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase">Slug</label>
            <input
              name="slug"
              placeholder="auto-generate if empty"
              className="input mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase">Description</label>
            <textarea
              name="description"
              rows={5}
              className="input mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase">Category</label>
            <select name="category_id" className="input mt-1">
              <option value="">Select category</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
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

        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-dark">Images</h2>

          <div>
            <label className="text-xs font-bold uppercase">Main Image</label>
            <input
              type="file"
              name="main_image"
              accept="image/*"
              className="input mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase">Gallery Images</label>
            <input
              type="file"
              name="gallery"
              accept="image/*"
              multiple
              className="input mt-1"
            />
          </div>
        </div>

        <div className="card space-y-5">
          <h2 className="text-xl font-bold text-dark">Variations</h2>

          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="border border-zinc-200 rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-dark">Variation {num}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name={`variation_name_${num}`}
                  placeholder="Name e.g. Size"
                  className="input"
                />
                <input
                  name={`variation_value_${num}`}
                  placeholder="Value e.g. Small"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  name={`variation_price_${num}`}
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  className="input"
                />
                <input
                  name={`variation_stock_${num}`}
                  type="number"
                  placeholder="Stock"
                  className="input"
                />
                <input
                  name={`variation_sku_${num}`}
                  placeholder="SKU"
                  className="input"
                />
              </div>

              <textarea
                name={`variation_description_${num}`}
                placeholder="Variation description"
                rows={2}
                className="input"
              />

              <input
                type="file"
                name={`variation_image_${num}`}
                accept="image/*"
                className="input"
              />
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary">
          Save Product
        </button>
      </form>
    </div>
  );
}