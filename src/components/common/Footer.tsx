import React from "react";
import Link from "next/link";
import { Clapperboard, Send, Instagram, ShieldCheck, Heart } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-[#0B0B0F]/90 text-text-muted text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-purple-glow">
                <Clapperboard className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white flex items-center gap-1.5">
                  <span className="text-primary">دیما</span> سینەما
                </span>
                <span className="text-[10px] font-bold text-accent tracking-widest -mt-1 uppercase">
                  DIMA CINEMA
                </span>
              </div>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed max-w-md">
              سەکۆی سینەمایی دیما پێشەنگە لە پێشکەشکردنی بەهێزترین و نوێترین فیلم و زنجیرە جیهانییەکان بە بەرزترین کوالیتی و بە ژێرنووسی کوردی سۆرانی. ئەزموونێکی سینەمایی خاوێن، بێ ڕیکلام و مۆدێرن.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/dimacinema"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all"
                aria-label="کەناڵی تێلێگرام"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/dimacinema"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all"
                aria-label="ئینستاگرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">بەستەرە سەرەکییەکان</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">لاپەڕەی سەرەکی</Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-primary transition-colors">هەموو فیلمەکان</Link>
              </li>
              <li>
                <Link href="/series" className="hover:text-primary transition-colors">هەموو زنجیرەکان</Link>
              </li>
              <li>
                <Link href="/subtitles" className="hover:text-primary transition-colors">بەرهەمە ژێرنووسکراوەکان</Link>
              </li>
              <li>
                <Link href="/request" className="hover:text-primary transition-colors">داواکردنی فیلم یان زنجیرە</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">یاسایی و پەیوەندی</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dmca" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>مافی لەبەرگرتنەوە (DMCA)</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">مەرجەکان و یاساکان</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">پاراستنی نهێنی</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">دەربارەی دیما سینەما</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">پەیوەندیکردن بە ئێمە</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="p-4 rounded-xl bg-surface/60 border border-border text-xs text-text-dim leading-relaxed mb-6">
          <p>
            تێبینی: سەرجەم ڤیدیۆ و فایلەکانی ناو ماڵپەڕی <strong className="text-text-muted">دیما سینەما</strong> لەلایەن سێرڤەر و پێشکەشکارە دەرەکییەکانەوە میوانداری دەکرێن و بە شێوازی Embed پەخش دەکرێن. هیچ فایلێک لەسەر ڕاژەکانی دیما سینەما هەڵناگیرێت. لە ئەگەری هەر داواکارییەکی مافی چاپ و پەخش، دەتوانن لە ڕێگەی فۆڕمی DMCA پەیوەندیمان پێوە بکەن.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-dim gap-4">
          <p>
            مافی پارێزراوە بۆ دیما سینەما © {toKurdishDigits(currentYear)}
          </p>
          <p className="flex items-center gap-1">
            دروستکراوە بە <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> بۆ بینەرانی کورد
          </p>
        </div>
      </div>
    </footer>
  );
}
