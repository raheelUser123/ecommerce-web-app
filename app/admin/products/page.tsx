import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { created?: string };
}) {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
{searchParams.created === "1" && (
  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
    ✅ Product has been added successfully.
  </div>
)}
        <Link
          href="/admin/products/new"
          className="btn btn-primary"
        >
          + Add Product
        </Link>
      </div>

      <div className="card overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((p: any) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">
                  <img
                    src={p.main_image || "/placeholder.png"}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>

                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.slug}</td>
                <td className="p-3">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}