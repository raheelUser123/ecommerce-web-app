"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useState } from "react";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name"));
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        name,
        email,
        role: "user",
        status: "active",
      });
    }

    setLoading(false);
    alert("Account created. Now login.");
  }

  return (
    <div className="max-w-md mx-auto card space-y-6">
      <h1 className="text-3xl font-extrabold text-dark">Create Account</h1>

      <form onSubmit={register} className="space-y-4">
        <input name="name" required placeholder="Full Name" className="input" />
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" required placeholder="Password" className="input" />

        <button disabled={loading} className="btn btn-primary w-full justify-center">
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <Link href="/login" className="text-primary font-bold text-sm">
        Already have account? Login
      </Link>
    </div>
  );
}