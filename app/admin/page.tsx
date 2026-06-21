import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export default async function AdminDashboard() {
  const [{ count: products }, { count: orders }, { count: users }, { data: revenueData }] =
    await Promise.all([
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("total_amount").eq("payment_status", "paid"),
    ]);

  const revenue =
    revenueData?.reduce((sum: number, item: any) => sum + Number(item.total_amount || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-dark">Admin Dashboard</h1>
        <p className="text-muted text-sm mt-1">Manage store products, orders, users and reviews.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-muted">Products</p>
          <p className="text-4xl font-extrabold">{products || 0}</p>
        </div>

        <div className="card">
          <p className="text-sm text-muted">Orders</p>
          <p className="text-4xl font-extrabold">{orders || 0}</p>
        </div>

        <div className="card">
          <p className="text-sm text-muted">Users</p>
          <p className="text-4xl font-extrabold">{users || 0}</p>
        </div>

        <div className="card">
          <p className="text-sm text-muted">Revenue</p>
          <p className="text-4xl font-extrabold">${revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-3">
        <Link className="btn btn-primary justify-center" href="/admin/products/new">
          + Add Product
        </Link>
        <Link className="btn justify-center" href="/admin/products">Products</Link>
        <Link className="btn justify-center" href="/admin/categories">Categories</Link>
        <Link className="btn justify-center" href="/admin/orders">Orders</Link>
        <Link className="btn justify-center" href="/admin/users">Users</Link>
        <Link className="btn justify-center" href="/admin/reviews">Reviews</Link>
      </div>
    </div>
  );
}