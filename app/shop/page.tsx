import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Search, SlidersHorizontal, Star, Heart, ArrowRight, Tag } from "lucide-react";

interface Props {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export default async function Shop({ searchParams }: Props) {
  const activeCategory = searchParams.category || "";
  const activeSearch = searchParams.search || "";
  const activeSort = searchParams.sort || "newest";

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "active");

  let query = supabase
    .from("products")
    .select("*, product_variations(*), product_categories(categories(*))")
    .eq("status", "active");

  const { data } = await query;

  let products = data || [];

  if (activeCategory) {
    products = products.filter((p: any) =>
      p.product_categories?.some((pc: any) => pc.categories?.slug === activeCategory)
    );
  }

  if (activeSearch) {
    const q = activeSearch.toLowerCase();
    products = products.filter((p: any) =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }

  if (activeSort === "price-low") {
    products.sort((a: any, b: any) => Number(a.product_variations?.[0]?.price || a.price || 0) - Number(b.product_variations?.[0]?.price || b.price || 0));
  }

  if (activeSort === "price-high") {
    products.sort((a: any, b: any) => Number(b.product_variations?.[0]?.price || b.price || 0) - Number(a.product_variations?.[0]?.price || a.price || 0));
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-dark tracking-tight">Shop Catalog</h1>
          <p className="text-muted text-sm mt-1">Showing {products.length} products</p>
        </div>

        <form method="GET" action="/shop">
          {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
          {activeSearch && <input type="hidden" name="search" value={activeSearch} />}
          <select name="sort" defaultValue={activeSort} className="input text-xs" >
            <option value="newest">Sort by: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="card p-5">
            <h3 className="font-bold text-dark text-sm uppercase tracking-wider mb-3">Search</h3>
            <form method="GET" action="/shop" className="relative">
              {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              <input
                type="text"
                name="search"
                defaultValue={activeSearch}
                placeholder="Find anything..."
                className="input text-xs pl-10"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
            </form>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-dark text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4" /> Categories
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link href="/shop" className={`text-sm py-2 px-3 rounded-xl font-medium ${!activeCategory ? "bg-primary text-white" : "text-dark/80 hover:bg-light-gray"}`}>
                All Departments
              </Link>
              {categories?.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}`}
                  className={`text-sm py-2 px-3 rounded-xl font-medium ${activeCategory === c.slug ? "bg-primary text-white" : "text-dark/80 hover:bg-light-gray"}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-5 border-dashed border-primary bg-primary-light flex items-center gap-4">
            <Tag className="w-5 h-5 text-primary" />
            <p className="text-xs text-dark font-extrabold">Use ORANGE50 for discount</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="card py-16 text-center space-y-4">
              <h3 className="text-2xl font-bold text-dark">No Products Found</h3>
              <p className="text-muted text-sm">No Supabase products matched your filters.</p>
              <Link href="/shop" className="btn btn-primary text-xs py-3.5">Reset Filters</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p: any) => {
                const price = Number(p.product_variations?.[0]?.price || p.price || 0);
                return (
                  <div key={p.id} className="card p-4 flex flex-col group h-full justify-between">
                    <div>
                      <div className="relative rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 aspect-square mb-4">
                        <button className="absolute top-3.5 right-3.5 p-2 bg-white/80 rounded-full z-10">
                          <Heart className="w-4 h-4" />
                        </button>
                        <img src={p.main_image || "/placeholder.png"} alt={p.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex text-primary mb-2">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      </div>

                      <h4 className="font-bold text-dark text-base line-clamp-1">{p.title}</h4>
                      <p className="text-muted text-xs line-clamp-2">{p.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-4">
                      <span className="text-base font-extrabold text-dark">${price.toFixed(2)}</span>
                      <Link href={`/product/${p.slug}`} className="btn btn-outline text-xs px-3.5 py-2.5">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}