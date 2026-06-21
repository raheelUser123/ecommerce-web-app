import { supabaseAdmin } from "@/lib/supabase";
import { updateOrderStatus } from "@/app/actions/admin";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-dark">Orders</h1>
        <p className="text-muted text-sm mt-1">
          Manage customer orders and payment status.
        </p>
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
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Items</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-right p-4">Update</th>
            </tr>
          </thead>

          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <tr key={order.id} className="border-b hover:bg-zinc-50 align-top">
                  <td className="p-4 font-bold">
                    #{order.order_number || order.id.slice(0, 8)}
                  </td>

                  <td className="p-4">
                    <p className="font-bold">
                      {order.customer_first_name || "Guest"}{" "}
                      {order.customer_last_name || ""}
                    </p>
                    <p className="text-xs text-muted">
                      {order.customer_email || "No email"}
                    </p>
                    <p className="text-xs text-muted">
                      {order.customer_city || ""} {order.customer_state || ""}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="text-xs">
                          <b>{item.product_title}</b> x {item.quantity}
                          <br />
                          <span className="text-muted">
                            {item.variation_detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 font-extrabold">
                    ${Number(order.total_amount || 0).toFixed(2)}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        order.payment_status === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold">
                      {order.order_status}
                    </span>
                  </td>

                  <td className="p-4 text-xs text-muted">
                    {new Date(order.created_at).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <form action={updateOrderStatus} className="flex justify-end gap-2">
                      <input type="hidden" name="id" value={order.id} />

                      <select
                        name="order_status"
                        defaultValue={order.order_status || "pending"}
                        className="input text-xs min-w-32"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button type="submit" className="rounded-xl bg-dark px-3 py-2 text-xs font-bold text-white">
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-8 text-center text-muted" colSpan={8}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}