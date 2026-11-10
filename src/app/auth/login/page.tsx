"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clapperboard, LogIn, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (res?.error) {
        setError("ئیمەیڵ یان وشەی نهێنی هەڵەیە");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("هەڵەیەک لە پەیوەندی هەیە");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center mx-auto shadow-purple-glow">
          <Clapperboard className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black text-white">چوونەژوورەوە بۆ دیما سینەما</h1>
        <p className="text-xs text-text-muted">
          تکایە ئیمەیڵ و وشەی نهێنی خۆت بنووسە
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
              placeholder="••••••••"
              className="w-full bg-surface-light border border-border rounded-xl ps-9 pe-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-purple-glow transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          <span>چوونەژوورەوە</span>
        </button>
      </form>

      <div className="text-center pt-2 border-t border-border">
        <p className="text-xs text-text-muted">
          هەژمارت نییە؟{" "}
          <Link href="/auth/register" className="text-primary hover:underline font-bold">
            هەژمارێکی نوێ دروستبکە
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="p-8 text-center text-xs text-text-muted">بارکردن...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
