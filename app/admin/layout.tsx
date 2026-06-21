import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
      <aside className=" h-fit md:sticky md:top-24 space-y-3">
        <h2 className="text-xl font-extrabold text-dark mb-4">Admin Panel</h2>

        <Link className="btn w-full justify-center" href="/admin">
          Dashboard
        </Link>
        <Link className="btn w-full justify-center" href="/admin/products">
          Products
        </Link>
        <Link className="btn w-full justify-center" href="/admin/products/new">
          Add Product
        </Link>
        <Link className="btn w-full justify-center" href="/admin/categories">
          Categories
        </Link>
        <Link className="btn w-full justify-center" href="/admin/orders">
          Orders
        </Link>
        <Link className="btn w-full justify-center" href="/">
          Back to Store
        </Link>
      </aside>

      <section>{children}</section>
    </div>
  );
}