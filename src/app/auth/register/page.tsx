"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Clapperboard, UserPlus, User, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تۆمارکردن سەرکەوتوو نەبوو");
        setLoading(false);
        return;
      }

      // Automatically sign in
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (!loginRes?.error) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/auth/login");
      }
    } catch {
      setError("هەڵەیەک لە پەیوەندی هەیە");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center mx-auto shadow-purple-glow">
            <Clapperboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">دروستکردنی هەژماری نوێ</h1>
          <p className="text-xs text-text-muted">
            بۆ پاراستنی دڵخوازەکانت و بەشداریکردن لە دیما سینەما
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              ناوی تەواو:
            </label>
            <div className="relative">
              <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ڕەوەند کاروان"
                className="w-full bg-surface-light border border-border rounded-xl ps-9 pe-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              ئیمەیڵ:
            </label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@dima.krd"
                className="w-full bg-surface-light border border-border rounded-xl ps-9 pe-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              وشەی نهێنی:
            </label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="لانیکەم ٦ پیت"
                className="w-full bg-surface-light border border-border rounded-xl ps-9 pe-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-purple-glow transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            <span>دروستکردنی هەژمار</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-text-muted">
            پێشتر هەژمارت دروستکردووە؟{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-bold">
              چوونەژوورەوە
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
