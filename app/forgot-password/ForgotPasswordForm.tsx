"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);

  async function reset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset email sent.");
  }

  return (
    <div className="max-w-md mx-auto card space-y-6">
      <h1 className="text-3xl font-extrabold text-dark">Forgot Password</h1>

      <form onSubmit={reset} className="space-y-4">
        <input name="email" type="email" required placeholder="Email" className="input" />

        <button disabled={loading} className="btn btn-primary w-full justify-center">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <Link href="/login" className="text-primary font-bold text-sm">
        Back to Login
      </Link>
    </div>
  );
}