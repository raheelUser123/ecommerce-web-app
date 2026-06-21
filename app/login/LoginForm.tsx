"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto card space-y-6">
      <h1 className="text-3xl font-extrabold text-dark">Admin Login</h1>

      <form onSubmit={login} className="space-y-4">
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" required placeholder="Password" className="input" />

        <button disabled={loading} className="btn btn-primary w-full justify-center">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex justify-between text-sm">
        <Link href="/register" className="text-primary font-bold">Register</Link>
        <Link href="/forgot-password" className="text-primary font-bold">Forgot Password?</Link>
      </div>
    </div>
  );
}