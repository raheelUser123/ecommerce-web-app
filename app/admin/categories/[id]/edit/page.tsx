import { supabaseAdmin } from "@/lib/supabase";
import { updateCategory } from "@/app/actions/admin";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const [{ data: category }, { data: categories }] = await Promise.all([
    supabaseAdmin.from("categories").select("*").eq("id", params.id).single(),
    supabaseAdmin.from("categories").select("*").neq("id", params.id).order("created_at", { ascending: false }),
  ]);

  if (!category) {
    return <div className="card">Category not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-3xl font-extrabold text-dark">Edit Category</h1>
        <p className="text-muted text-sm mt-1">{category.name}</p>
      </div>

      <form action={updateCategory} className="card space-y-4">
        <input type="hidden" name="id" value={category.id} />

        <div>
          <label className="text-xs font-bold uppercase">Name</label>
          <input name="name" defaultValue={category.name} required className="input mt-1" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase">Slug</label>
          <input name="slug" defaultValue={category.slug} className="input mt-1" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase">Parent Category</label>
          <select name="parent_id" defaultValue={category.parent_id || ""} className="input mt-1">
            <option value="">None / Main Category</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase">Current Image</label>
          {category.image ? (
            <img src={category.image} className="w-28 h-28 object-cover rounded-xl border mt-2" />
          ) : (
            <p className="text-sm text-muted mt-2">No image</p>
          )}
        </div>

        <div>
          <label className="text-xs font-bold uppercase">New Image</label>
          <input type="file" name="image" accept="image/*" className="input mt-1" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase">Status</label>
          <select name="status" defaultValue={category.status || "active"} className="input mt-1">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Category
        </button>
      </form>
    </div>
  );
}