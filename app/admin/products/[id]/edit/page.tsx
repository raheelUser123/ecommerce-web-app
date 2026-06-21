import { supabaseAdmin } from "@/lib/supabase";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [{ data: product }, { data: categories }, { data: productCategory }] =
    await Promise.all([
      supabaseAdmin
        .from("products")
        .select("*, product_variations(*), product_gallery(*)")
        .eq("id", params.id)
        .single(),

      supabaseAdmin
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false }),

      supabaseAdmin
        .from("product_categories")
        .select("*")
        .eq("product_id", params.id)
        .maybeSingle(),
    ]);

  if (!product) {
    return <div className="card">Product not found.</div>;
  }

  return (
    <EditProductForm
      product={product}
      categories={categories || []}
      productCategory={productCategory}
    />
  );
}