import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductDetailsClient from "@/components/ProductDetailsClient";

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
 const { data: p } = await supabase
  .from("products")
  .select(`
    *,
    product_variations(*),
    product_gallery(*),
    reviews(*)
  `)
  .eq("slug", params.slug)
  .eq("status", "active")
  .single();

  if (!p) {
    return (
      <div className="card py-16 text-center space-y-4 max-w-lg mx-auto mt-12">
        <h1 className="text-3xl font-extrabold text-dark">Product Not Found</h1>
        <p className="text-muted text-sm">This product does not exist in Supabase.</p>
        <Link href="/shop" className="btn btn-primary text-xs py-3.5 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  return <ProductDetailsClient product={p} />;
}