import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "تکایە هەموو خانەکان پڕبکەرەوە" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "وشەی نهێنی نابێت لە ٦ پیت کەمتر بێت" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "ئەم ئیمەیڵە پێشتر تۆمارکراوە" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "تۆمارکردن سەرکەوتوو نەبوو" }, { status: 500 });
  }
}
