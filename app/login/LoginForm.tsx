"use client";

import { loginAdmin } from "@/app/actions/auth";
import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="max-w-md mx-auto card space-y-6">
      <h1 className="text-3xl font-extrabold text-dark">Admin Login</h1>

      <form action={loginAdmin} className="space-y-4">
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" required placeholder="Password" className="input" />

        <button className="btn btn-primary w-full justify-center">
          Login
        </button>
      </form>

      <div className="flex justify-between text-sm">
        <Link href="/register" className="text-primary font-bold">Register</Link>
        <Link href="/forgot-password" className="text-primary font-bold">Forgot Password?</Link>
      </div>
    </div>
  );
}