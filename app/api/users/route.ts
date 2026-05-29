import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ================= GET USERS =================
export async function GET() {
  const users = await prisma.users.findMany();

  return NextResponse.json(users);
}

// ================= TAMBAH USER =================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const hashed = await bcrypt.hash(
      body.password,
      10
    );

    await prisma.users.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashed,
        role: body.role,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil dibuat",
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Gagal membuat user",
    });
  }
}