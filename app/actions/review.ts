"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReview(formData: FormData) {
  const product_id = String(formData.get("product_id") || "");
  const product_slug = String(formData.get("product_slug") || "");
  const customer_name = String(formData.get("customer_name") || "").trim();
  const customer_email = String(formData.get("customer_email") || "").trim();
  const rating = Number(formData.get("rating") || 5);
  const review = String(formData.get("review") || "").trim();

  if (!product_id || !customer_name || !review) {
    throw new Error("Missing review fields");
  }

  const { error } = await supabaseAdmin.from("reviews").insert({
    product_id,
    customer_name,
    customer_email,
    rating,
    review,
    status: "pending",
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/product/${product_slug}`);
  redirect(`/product/${product_slug}?review=success`);
}