import { supabaseAdmin } from "@/lib/supabase";

export default async function ReviewsPage() {
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("*, products(title)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-dark">Reviews</h1>
        <p className="text-muted text-sm mt-1">Customer product reviews.</p>
      </div>

      <div className="card overflow-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b">
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Rating</th>
              <th className="text-left p-4">Review</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {reviews && reviews.length > 0 ? (
              reviews.map((review: any) => (
                <tr key={review.id} className="border-b hover:bg-zinc-50 align-top">
                  <td className="p-4 font-bold">
                    {review.products?.title || "Unknown product"}
                  </td>
                  <td className="p-4 font-bold text-primary">
                    {"★".repeat(Number(review.rating || 0))}
                  </td>
                  <td className="p-4 max-w-md text-muted">
                    {review.review || "-"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        review.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {review.status || "pending"}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-8 text-center text-muted" colSpan={5}>
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}