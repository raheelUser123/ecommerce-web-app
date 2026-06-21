  import Link from "next/link";
  import { supabase } from "@/lib/supabase";
  import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star, ArrowUpRight, Flame, Heart } from "lucide-react";

  export default async function Home() {
    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .eq("status", "active")
      .limit(4);

    const { data: products } = await supabase
      .from("products")
      .select("*, product_variations(*)")
      .eq("status", "active")
      .limit(6);

    return (
      // PAGE.TSX
      <div className="space-y-20 pb-12">
        <section className="relative overflow-hidden rounded-3xl bg-orange-subtle-gradient border border-orange-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 py-16 lg:px-16 lg:py-24">
            <div className="space-y-6 text-left max-w-xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-accent-orange text-primary rounded-full text-xs font-semibold">
                <Flame className="w-3.5 h-3.5" /> THE EXCLUSIVE SUMMER DROP IS LIVE
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-dark tracking-tight leading-tight">
                Bold Styles. <br />
                <span className="text-orange-gradient">Uncompromised</span> Quality.
              </h1>
              <p className="text-muted text-base leading-relaxed">
                Explore our WooCommerce-style custom store with categories, variations and Stripe checkout.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/shop" className="btn btn-primary px-8 py-4">
                  Shop The Drop <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/shop" className="btn btn-outline px-8 py-4">
                  Explore Products
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <img
                src={products?.[0]?.main_image || "/placeholder.png"}
                alt="Featured product"
                className="w-80 h-96 object-cover rounded-2xl shadow-2xl border-4 border-white rotate-2"
              />
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-sm font-extrabold text-primary tracking-wider uppercase mb-3">Our Core Philosophy</h2>
          <h3 className="text-3xl font-extrabold text-dark mb-12">Engineered For Premium Comfort</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-left space-y-4">
              <Truck className="w-8 h-8 text-primary" />
              <h4 className="text-lg font-bold text-dark">Free Worldwide Delivery</h4>
              <p className="text-muted text-sm">We ship worldwide with express delivery options.</p>
            </div>
            <div className="card text-left space-y-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <h4 className="text-lg font-bold text-dark">Stripe Secure Checkout</h4>
              <p className="text-muted text-sm">Payments are handled through Stripe checkout.</p>
            </div>
            <div className="card text-left space-y-4">
              <RefreshCw className="w-8 h-8 text-primary" />
              <h4 className="text-lg font-bold text-dark">Easy Returns</h4>
              <p className="text-muted text-sm">Simple return and refund process for customers.</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-zinc-200 pb-5">
            <div>
              <h2 className="text-sm font-extrabold text-primary tracking-wider uppercase mb-2">Browse Catalogs</h2>
              <h3 className="text-3xl font-extrabold text-dark">Categories</h3>
            </div>
            <Link href="/shop" className="text-sm font-bold text-primary flex items-center gap-1">
              Shop Catalog <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((c: any) => (
                <Link key={c.id} href={`/shop?category=${c.slug}`} className="card block space-y-3">
                  <img src={c.image || "/placeholder.png"} alt={c.name} className="w-full h-48 object-cover rounded-xl" />
                  <h4 className="text-xl font-bold text-dark">{c.name}</h4>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center text-muted">No categories found.</div>
          )}
        </section>

        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-zinc-200 pb-5">
            <div>
              <h2 className="text-sm font-extrabold text-primary tracking-wider uppercase mb-2">Selected Gear</h2>
              <h3 className="text-3xl font-extrabold text-dark">Latest Arrivals</h3>
            </div>
            <Link href="/shop" className="text-sm font-bold text-primary flex items-center gap-1">
              View All Products <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p: any) => {
                const price = Number(p.product_variations?.[0]?.price || p.price || 0);
                return (
                  <div key={p.id} className="card p-4 flex flex-col group h-full">
                    <div className="relative rounded-xl overflow-hidden bg-zinc-50 aspect-square mb-4">
                      <button className="absolute top-3.5 right-3.5 p-2 bg-white/80 rounded-full z-10">
                        <Heart className="w-4 h-4" />
                      </button>
                      <img src={p.main_image || "/placeholder.png"} alt={p.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex text-primary mb-2">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>

                    <h4 className="font-bold text-dark text-lg">{p.title}</h4>
                    <p className="text-muted text-xs line-clamp-2 mb-4">{p.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-auto">
                      <span className="text-lg font-extrabold text-dark">${price.toFixed(2)}</span>
                      <Link href={`/product/${p.slug}`} className="btn btn-outline text-xs px-4 py-2">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card text-center text-muted">No products found from Supabases.</div>
          )}
        </section>
      </div>
    );
  }