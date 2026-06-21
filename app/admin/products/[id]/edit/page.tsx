import { supabaseAdmin } from "@/lib/supabase";
import { updateProduct } from "@/app/actions/admin";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [{ data: product }, { data: categories }, { data: productCategory }] =
    await Promise.all([
      supabaseAdmin
        .from("products")
        .select("*, product_variations(*)")
        .eq("id", params.id)
        .single(),

      supabaseAdmin
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false }),

      supabaseAdmin
        .from("product_categories")
        .select("*")
        .eq("product_id", params.id)
        .maybeSingle(),
    ]);

  if (!product) {
    return <div className="card">Product not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-3xl font-extrabold text-dark">Edit Product</h1>
        <p className="text-muted text-sm mt-1">{product.title}</p>
      </div>

      <form action={updateProduct} className="space-y-6">
        <input type="hidden" name="id" value={product.id} />

        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-dark">Product Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase">Title</label>
              <input
                name="title"
                defaultValue={product.title}
                required
                className="input mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Slug</label>
              <input
                name="slug"
                defaultValue={product.slug}
                className="input mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase">Description</label>
            <textarea
              name="description"
              rows={5}
              defaultValue={product.description || ""}
              className="input mt-1"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase">Base Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price || 0}
                className="input mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Category</label>
              <select
                name="category_id"
                defaultValue={productCategory?.category_id || ""}
                className="input mt-1"
              >
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
              <select
                name="status"
                defaultValue={product.status || "active"}
                className="input mt-1"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-dark">Product Image</h2>

          {product.main_image && (
            <img
              src={product.main_image}
              className="w-32 h-32 object-cover rounded-xl border"
              alt={product.title}
            />
          )}

          <input
            type="file"
            name="main_image"
            accept="image/*"
            className="input mt-1"
          />
        </div>

        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-dark">Variations / Prices</h2>

          {product.product_variations &&
          product.product_variations.length > 0 ? (
            product.product_variations.map((v: any, index: number) => (
              <div
                key={v.id}
                className="border border-zinc-200 rounded-xl p-4 space-y-3"
              >
                <input type="hidden" name="variation_id" value={v.id} />

                <h3 className="font-bold text-dark">Variation {index + 1}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="variation_name"
                    defaultValue={v.name}
                    placeholder="Name e.g. Size"
                    className="input"
                  />

                  <input
                    name="variation_value"
                    defaultValue={v.value}
                    placeholder="Value e.g. Small"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    name="variation_price"
                    type="number"
                    step="0.01"
                    defaultValue={v.price}
                    placeholder="Price"
                    className="input"
                  />

                  <input
                    name="variation_stock"
                    type="number"
                    defaultValue={v.stock}
                    placeholder="Stock"
                    className="input"
                  />

                  <input
                    name="variation_sku"
                    defaultValue={v.sku || ""}
                    placeholder="SKU"
                    className="input"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted">
              No variations found for this product.
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
      </form>
    </div>
  );
}