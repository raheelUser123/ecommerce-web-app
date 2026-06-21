import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const { data: p } = await supabase
    .from("products")
    .select("*, product_variations(*), product_gallery(*), reviews(*)")
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

  const basePrice = Number(p.product_variations?.[0]?.price || p.price || 0);
  const inStock = p.product_variations?.some((v: any) => v.stock > 0) ?? true;
  const totalReviews = p.reviews?.length || 0;

  return (
    <div className="space-y-16 pb-12">
      <div className="flex items-center gap-2 text-xs text-muted font-medium">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <span>/</span>
        <span className="text-dark font-semibold">{p.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 aspect-square">
            <img src={p.main_image || "/placeholder.png"} alt={p.title} className="w-full h-full object-cover" />
          </div>

          {p.product_gallery && p.product_gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {p.product_gallery.map((g: any) => (
                <div key={g.id} className="rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 aspect-square">
                  <img src={g.image} alt="Product gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${inStock ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {inStock ? "In Stock" : "Out of Stock"}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-muted">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <span className="font-semibold text-dark">({totalReviews} Reviews)</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-dark tracking-tight">{p.title}</h1>
              <p className="text-2xl font-extrabold text-primary mt-2">${basePrice.toFixed(2)}</p>
            </div>

            <p className="text-muted text-sm leading-relaxed border-b border-zinc-100 pb-5">{p.description}</p>

            {p.product_variations && p.product_variations.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-dark text-xs uppercase tracking-wider">Variants</h3>
                <div className="flex flex-wrap gap-2.5">
                  {p.product_variations.map((v: any, index: number) => (
                    <div key={v.id} className={`border rounded-xl py-3 px-4 flex items-center gap-4 ${index === 0 ? "border-primary bg-primary-light text-primary font-bold" : "border-zinc-200 text-dark/80"}`}>
                      {index === 0 && <Check className="w-3.5 h-3.5" />}
                      <span className="text-xs">{v.name}: {v.value}</span>
                      <span className="text-xs font-bold">${Number(v.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AddToCartButton product={p} />

            <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 pt-6 text-center">
              <div><Truck className="w-5 h-5 mx-auto text-primary" /><p className="text-[10px] font-bold">Express Ship</p></div>
              <div><ShieldCheck className="w-5 h-5 mx-auto text-primary" /><p className="text-[10px] font-bold">Secure Stripe</p></div>
              <div><RefreshCw className="w-5 h-5 mx-auto text-primary" /><p className="text-[10px] font-bold">Easy Returns</p></div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-lg font-extrabold text-dark border-b border-zinc-200 pb-4">Customer Reviews ({totalReviews})</h2>

        {p.reviews && p.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {p.reviews.map((r: any) => (
              <div key={r.id} className="card p-6 space-y-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
                <p className="text-muted text-xs italic">"{r.review}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card py-8 text-center text-muted text-sm">
            No reviews yet.
          </div>
        )}
      </section>
    </div>
  );
}