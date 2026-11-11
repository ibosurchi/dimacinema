import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SessionProvider from "@/components/providers/SessionProvider";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "دیما سینەما | DIMA Cinema - سەکۆی فیلم و زنجیرە کوردییەکان",
  description:
    "تەماشاکردنی نوێترین و بەهێزترین فیلم و زنجیرە جیهانییەکان بە کوالیتی بەرز و بە ژێرنووسی کوردی سۆرانی بێ ڕیکلام و بە شێوازێکی مۆدێرن.",
  keywords: [
    "دیما سینەما",
    "dima cinema",
    "کوردسینەما",
    "kurdcinama",
    "فیلمی کوردی",
    "ژێرنووسی کوردی",
    "زنجیرەی کوردی",
    "kurdsubtitle",
    "streaming kurdish",
  ],
  authors: [{ name: "DIMA Cinema Team" }],
  openGraph: {
    title: "دیما سینەما | DIMA Cinema",
    description: "سەکۆی سەرەکی فیلم و زنجیرە بە ژێرنووسی کوردی",
    url: "https://dima.krd",
    siteName: "دیما سینەما",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "دیما سینەما",
      },
    ],
    locale: "ckb_IQ",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ckb" dir="rtl" className="dark">
      <head>
        <meta name="theme-color" content="#0B0B0F" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-screen bg-background text-text-primary flex flex-col antialiased selection:bg-primary selection:text-white">
        <NextTopLoader
          color="#8B5CF6"
          initialPosition={0.15}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={250}
          shadow="0 0 10px #8B5CF6,0 0 5px #EC4899"
        />
        <SessionProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
