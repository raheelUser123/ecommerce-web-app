import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { createCategory, deleteCategory } from "@/app/actions/admin";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("*, parent:parent_id(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-dark">Categories</h1>
        <p className="text-muted text-sm mt-1">
          Manage product categories and subcategories.
        </p>
      </div>

      {searchParams.success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
          ✅ {searchParams.success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="card space-y-4 h-fit">
          <h2 className="text-xl font-bold text-dark">Add Category</h2>

          <form action={createCategory} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase">Name</label>
              <input name="name" required className="input mt-1" />
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Slug</label>
              <input
                name="slug"
                placeholder="auto generate if empty"
                className="input mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase">
                Parent Category
              </label>
              <select name="parent_id" className="input mt-1">
                <option value="">None / Main Category</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="input mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Status</label>
              <select name="status" className="input mt-1">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-full justify-center">
              Save Category
            </button>
          </form>
        </div>

        <div className="card overflow-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50">
              <tr className="border-b">
                <th className="text-left p-4">Image</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Slug</th>
                <th className="text-left p-4">Parent</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories && categories.length > 0 ? (
                categories.map((cat: any) => (
                  <tr key={cat.id} className="border-b hover:bg-zinc-50">
                    <td className="p-4">
                      <img
                        src={cat.image || "/placeholder.png"}
                        alt={cat.name}
                        className="w-14 h-14 object-cover rounded-xl border"
                      />
                    </td>

                    <td className="p-4 font-bold text-dark">{cat.name}</td>
                    <td className="p-4 text-muted">{cat.slug}</td>
                    <td className="p-4">{cat.parent?.name || "Main"}</td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          cat.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/shop?category=${cat.slug}`}
                          className="rounded-xl border px-3 py-2 text-xs font-bold hover:bg-zinc-50"
                        >
                          View
                        </Link>
<Link
  href={`/admin/categories/${cat.id}/edit`}
  className="rounded-xl border px-3 py-2 text-xs font-bold hover:bg-zinc-50"
>
  Edit
</Link>
                        <form action={deleteCategory}>
                          <input type="hidden" name="id" value={cat.id} />
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
                ))
              ) : (
                <tr>
                  <td className="p-8 text-center text-muted" colSpan={6}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}