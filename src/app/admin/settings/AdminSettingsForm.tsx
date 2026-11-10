"use client";

import React, { useState } from "react";
import { Save, Check, Loader2, AlertCircle } from "lucide-react";

export default function AdminSettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [siteName, setSiteName] = useState(
    initialSettings.site_name || "دیما سینەما - DIMA Cinema"
  );
  const [siteDescription, setSiteDescription] = useState(
    initialSettings.site_description || ""
  );
  const [announcement, setAnnouncement] = useState(
    initialSettings.announcement || ""
  );
  const [telegramUrl, setTelegramUrl] = useState(
    initialSettings.telegram_url || ""
  );
  const [instagramUrl, setInstagramUrl] = useState(
    initialSettings.instagram_url || ""
  );
  const [contactEmail, setContactEmail] = useState(
    initialSettings.contact_email || ""
  );

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_name: siteName,
          site_description: siteDescription,
          announcement,
          telegram_url: telegramUrl,
          instagram_url: instagramUrl,
          contact_email: contactEmail,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      alert("هەڵە لە پاشەکەوتکردن");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>ڕێکخستنەکان بە سەرکەوتوویی پاشەکەوتکران!</span>
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-border pb-2.5">
          زانیارییە گشتییەکان
        </h3>

        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1.5">
            ناوی ماڵپەڕ (Brand Title):
          </label>
          <input
            type="text"
            required
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1.5">
            پێناسەی ماڵپەڕ (SEO Description):
          </label>
          <textarea
            rows={2}
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs sm:text-sm text-white outline-none focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1.5">
            پەیامی ئاگاداری سەرەوە (Announcement Banner):
          </label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-border pb-2.5">
          تۆڕە کۆمەڵایەتییەکان و پەیوەندی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              لینکی تێلێگرام:
            </label>
            <input
              type="url"
              value={telegramUrl}
              onChange={(e) => setTelegramUrl(e.target.value)}
              placeholder="https://t.me/dimacinema"
              className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary dir-ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              لینکی ئینستاگرام:
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/dimacinema"
              className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary dir-ltr"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              ئیمەیڵی فەرمی پەیوەندی:
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@dima.krd"
              className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary dir-ltr"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-purple-glow transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>پاشەکەوتکردنی ڕێکخستنەکان</span>
        </button>
      </div>
    </form>
  );
}
