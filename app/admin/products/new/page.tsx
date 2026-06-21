import { supabaseAdmin } from "@/lib/supabase";
import NewProductForm from "./NewProductForm";

export default async function NewProductPage() {
  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return <NewProductForm categories={categories || []} />;
}