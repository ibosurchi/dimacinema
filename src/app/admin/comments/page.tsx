import React from "react";
import { prisma } from "@/lib/prisma";
import { MessageSquare } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";
import AdminCommentsManager from "./AdminCommentsManager";

export const revalidate = 0;

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      movie: { select: { titleKurdish: true, slug: true } },
      episode: { select: { titleKurdish: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-black text-white">بەڕێوەبردنی لێدوانەکان</h1>
        <p className="text-xs text-text-muted mt-1">
          سەرجەم بۆچوونەکانی بینەران ({toKurdishDigits(comments.length)} لێدوان)
        </p>
      </div>

      <AdminCommentsManager initialComments={comments} />
    </div>
  );
}
