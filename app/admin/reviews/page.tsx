import { supabaseAdmin } from "@/lib/supabase";
import { updateReviewStatus, deleteReview } from "@/app/actions/admin";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("*, products(title, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-dark">Reviews</h1>
        <p className="text-muted text-sm mt-1">Approve, reject or delete customer reviews.</p>
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
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Rating</th>
              <th className="text-left p-4">Review</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reviews && reviews.length > 0 ? (
              reviews.map((review: any) => (
                <tr key={review.id} className="border-b hover:bg-zinc-50 align-top">
                  <td className="p-4">
                    <p className="font-bold">{review.products?.title || "Unknown product"}</p>
                    <p className="text-xs text-muted">{review.products?.slug}</p>
                  </td>

                  <td className="p-4">
                    <p className="font-bold">{review.customer_name || "Guest"}</p>
                    <p className="text-xs text-muted">{review.customer_email || "-"}</p>
                  </td>

                  <td className="p-4 font-bold text-primary">
                    {"★".repeat(Number(review.rating || 0))}
                  </td>

                  <td className="p-4 max-w-md text-muted">{review.review || "-"}</td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        review.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : review.status === "rejected"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {review.status || "pending"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <form action={updateReviewStatus}>
                        <input type="hidden" name="id" value={review.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">
                          Approve
                        </button>
                      </form>

                      <form action={updateReviewStatus}>
                        <input type="hidden" name="id" value={review.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold text-white">
                          Reject
                        </button>
                      </form>

                      <form action={deleteReview}>
                        <input type="hidden" name="id" value={review.id} />
                        <button className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white">
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