"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeaderCartIcon() {
  const [count, setCount] = useState(0);

  function updateCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0);
    setCount(total);
  }

  useEffect(() => {
    updateCount();

    window.addEventListener("storage", updateCount);
    window.addEventListener("cart-updated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cart-updated", updateCount);
    };
  }, []);

  return (
    <Link href="/cart" className="relative p-2.5 text-dark hover:text-primary hover:bg-primary-light rounded-full transition-all">
      <ShoppingBag className="w-5 h-5" />

      {count > 0 && (
        <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
          {count}
        </span>
      )}
    </Link>
  );
}