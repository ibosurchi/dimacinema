import React from "react";
import { prisma } from "@/lib/prisma";
import AdminSettingsForm from "./AdminSettingsForm";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settingsRows = await prisma.siteSetting.findMany();
  const settings: Record<string, string> = {};
  settingsRows.forEach((s) => {
    settings[s.key] = s.value;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-black text-white">ڕێکخستنە گشتییەکانی ماڵپەڕ</h1>
        <p className="text-xs text-text-muted mt-1">
          گۆڕینی ناوی ماڵپەڕ، پەیامی ئاگاداری، بەستەرەکانی تۆڕە کۆمەڵایەتییەکان
        </p>
      </div>

      <AdminSettingsForm initialSettings={settings} />
    </div>
  );
}
