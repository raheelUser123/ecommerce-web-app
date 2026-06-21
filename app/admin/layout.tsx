import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role,email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
      <aside className="card h-fit md:sticky md:top-24 space-y-3">
        <h2 className="text-xl font-extrabold text-dark mb-4">Admin Panel</h2>

        <Link className="btn w-full justify-center" href="/admin">Dashboard</Link>
        <Link className="btn w-full justify-center" href="/admin/products">Products</Link>
        <Link className="btn w-full justify-center" href="/admin/products/new">Add Product</Link>
        <Link className="btn w-full justify-center" href="/admin/categories">Categories</Link>
        <Link className="btn w-full justify-center" href="/admin/orders">Orders</Link>
        <Link className="btn w-full justify-center" href="/admin/users">Users</Link>
        <Link className="btn w-full justify-center" href="/admin/reviews">Reviews</Link>
        <Link className="btn w-full justify-center" href="/">Back to Store</Link>
      </aside>

      <section>{children}</section>
    </div>
  );
}