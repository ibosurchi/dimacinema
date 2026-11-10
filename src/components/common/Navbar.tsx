"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Search, 
  Menu, 
  X, 
  Film, 
  Tv, 
  Subtitles, 
  HelpCircle, 
  User, 
  ShieldAlert, 
  LogOut, 
  Bookmark, 
  History,
  Clapperboard,
  Heart
} from "lucide-react";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "سەرەکی", href: "/" },
    { label: "فیلمەکان", href: "/movies" },
    { label: "زنجیرەکان", href: "/series" },
    { label: "ژێرنووسەکان", href: "/subtitles" },
    { label: "داواکاری", href: "/request" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? "glass-nav py-3 shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-purple-glow group-hover:scale-105 transition-transform">
                <Clapperboard className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span className="text-primary font-black">دیما</span> سینەما
                </span>
                <span className="text-[10px] font-bold text-accent tracking-widest -mt-1 uppercase">
                  DIMA CINEMA
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10 font-bold"
                        : "text-text-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-light/80 hover:bg-surface-hover border border-border text-text-muted hover:text-white text-xs transition-all cursor-pointer"
              title="گەڕان (Search)"
            >
              <Search className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">گەڕان...</span>
            </button>

            {/* Admin Quick Button (If User is Admin) */}
            {session?.user && (session.user as any).role === "ADMIN" && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary hover:text-white text-xs font-bold transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>کۆنتڕۆڵ</span>
              </Link>
            )}

            {/* User Profile / Auth State */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-light border border-transparent hover:border-border transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs uppercase">
                    {session.user.name ? session.user.name.charAt(0) : "D"}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute end-0 mt-2 w-52 bg-surface border border-border rounded-2xl shadow-card py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
                      <p className="text-[11px] text-text-dim truncate">{session.user.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-muted hover:text-white hover:bg-surface-light transition-colors"
                    >
                      <User className="w-4 h-4 text-primary" />
                      <span>پڕۆفایل و ڕێکخستن</span>
                    </Link>

                    <Link
                      href="/profile?tab=watchlist"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-muted hover:text-white hover:bg-surface-light transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-accent" />
                      <span>لیستی دڵخوازەکان</span>
                    </Link>

                    <Link
                      href="/profile?tab=history"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-muted hover:text-white hover:bg-surface-light transition-colors"
                    >
                      <History className="w-4 h-4 text-text-muted" />
                      <span>مێژووی بینینەکان</span>
                    </Link>

                    {(session.user as any).role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-primary font-bold hover:bg-primary/10 transition-colors border-t border-border mt-1"
                      >
                        <ShieldAlert className="w-4 h-4 text-primary" />
                        <span>داشبۆردی بەڕێوەبەر</span>
                      </Link>
                    )}

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>دەرچوون</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>چوونەژوورەوە</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-text-muted hover:text-white hover:bg-surface-light border border-border"
              aria-label="مێنیو"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-6 bg-surface border-b border-border space-y-1 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-text-muted hover:text-white hover:bg-surface-light"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {session?.user && (session.user as any).role === "ADMIN" && (
              <Link
                href="/admin"
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/10 border border-primary/20"
              >
                داشبۆردی بەڕێوەبەر (ئەدمین)
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Global Live Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
