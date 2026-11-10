import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  AlertTriangle, 
  MessageSquare, 
  Sliders, 
  Settings, 
  PlaySquare, 
  LogOut,
  ExternalLink,
  Clapperboard,
  Link as LinkIcon
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin");
  }

  const menuItems = [
    { label: "داشبۆردی سەرەکی", href: "/admin", icon: LayoutDashboard },
    { label: "بەڕێوەبردنی فیلمەکان", href: "/admin/movies", icon: Film },
    { label: "بەڕێوەبردنی زنجیرەکان", href: "/admin/series", icon: Tv },
    { label: "دەستکاریکردنی سلایدەر", href: "/admin/slider", icon: PlaySquare },
    { label: "ڕاپۆرتی کێشەی سێرڤەر", href: "/admin/reports", icon: AlertTriangle },
    { label: "تاقیکردنەوەی بەستەر", href: "/admin/link-tester", icon: LinkIcon },
    { label: "لێدوان و بۆچوونەکان", href: "/admin/comments", icon: MessageSquare },
    { label: "ڕیزەکانی لاپەڕەی سەرەکی", href: "/admin/home-rows", icon: Sliders },
    { label: "ڕێکخستنەکانی ماڵپەڕ", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#09090D] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-s border-border flex flex-col shrink-0">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div>
              <p className="font-black text-sm text-white">دیما کۆنتڕۆڵ</p>
              <p className="text-[10px] text-accent font-bold uppercase tracking-widest">ADMIN PANEL</p>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="p-1.5 rounded-lg bg-surface-light hover:bg-surface-hover text-text-muted hover:text-white border border-border"
            title="بینینی ماڵپەڕ"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-white hover:bg-surface-light transition-all group"
              >
                <Icon className="w-4 h-4 text-text-dim group-hover:text-primary transition-colors" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-text-dim">
            <span className="truncate max-w-[120px]">{session.user.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold text-[10px]">
              ئەدمین
            </span>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
