import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="card max-w-xl mx-auto py-16 text-center space-y-4">
      <h1 className="text-3xl font-extrabold text-dark">Payment Successful</h1>
      <p className="text-muted text-sm">Your order has been placed successfully.</p>
      <Link href="/shop" className="btn btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}