import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "تەنها بەڕێوەبەر بۆی هەیە وێنە ئەپلۆد بکات" }, { status: 401 });
    }

    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "هیچ وێنەیەک دیاری نەکراوە" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate mime-type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "تەنها فۆرماتی وێنەکان (JPG, PNG, WebP) ڕێگەپێدراون" }, { status: 400 });
    }

    // Determine extension
    const ext = file.name.split(".").pop() || "jpg";
    const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: publicUrl, success: true });
  } catch (err: any) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: err.message || "کێشەیەک ڕوویدا لە کاتی ئەپلۆدکردندا" }, { status: 500 });
  }
}
