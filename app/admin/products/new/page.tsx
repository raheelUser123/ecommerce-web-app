import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { deleteProduct } from "@/app/actions/admin";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("*, product_variations(*), product_gallery(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Products</h1>
          <p className="text-muted text-sm mt-1">Manage all store products.</p>
        </div>

        <Link href="/admin/products/new" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {searchParams.success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
          ✅ {searchParams.success}
        </div>
      )}

      <div className="card overflow-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b">
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Variations</th>
              <th className="text-left p-4">Gallery</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products && products.length > 0 ? (
              products.map((p: any) => {
                const price = Number(p.product_variations?.[0]?.price || p.price || 0);

                return (
                  <tr key={p.id} className="border-b hover:bg-zinc-50">
                    <td className="p-4">
                      <img
                        src={p.main_image || "/placeholder.png"}
                        alt={p.title}
                        className="w-16 h-16 object-cover rounded-xl border"
                      />
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-dark">{p.title}</p>
                      <p className="text-xs text-muted">{p.slug}</p>
                    </td>

                    <td className="p-4 font-bold">${price.toFixed(2)}</td>

                    <td className="p-4">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold">
                        {p.product_variations?.length || 0}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold">
                        {p.product_gallery?.length || 0}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          p.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          className="rounded-xl border px-3 py-2 text-xs font-bold hover:bg-zinc-50"
                        >
                          View
                        </Link>

                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="p-8 text-center text-muted" colSpan={7}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}