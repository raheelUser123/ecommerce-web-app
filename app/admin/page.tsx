import Link from "next/link";
import { supabase } from "@/lib/supabase";
export default async function Admin() {
  const [{ count: products }, { count: orders }, { count: users }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <b>Products</b>
          <p className="text-3xl">{products || 0}</p>
        </div>
        <div className="card">
          <b>Orders</b>
          <p className="text-3xl">{orders || 0}</p>
        </div>
        <div className="card">
          <b>Users</b>
          <p className="text-3xl">{users || 0}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-5 gap-3">
        <Link className="btn" href="/admin/products">
          Products
        </Link>
        <Link className="btn" href="/admin/categories">
          Categories
        </Link>
        <Link className="btn" href="/admin/orders">
          Orders
        </Link>
        <Link className="btn" href="/admin/users">
          Users
        </Link>
        <Link className="btn" href="/admin/reviews">
          Reviews
        </Link>
      </div>
    </div>
  );
}
