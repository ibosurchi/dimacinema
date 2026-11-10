import { NextResponse } from "next/server";
import { normalizeStreamUrl, detectProvider } from "@/lib/player/providers";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, error: "بەستەر داواکراوە" }, { status: 400 });
    }

    const result = normalizeStreamUrl(url);
    const provider = detectProvider(url);

    return NextResponse.json({
      ...result,
      providerName: provider.name,
      providerNameKurdish: provider.nameKurdish,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "هەڵەیەک ڕوویدا لە پشکنینی بەستەرەکە" }, { status: 500 });
  }
}
