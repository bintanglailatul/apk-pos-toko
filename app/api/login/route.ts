import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

  const isMatch = await bcrypt.compare(
  password,
  user.password || ""
);

if (!isMatch) {
  return NextResponse.json(
    {
      success: false,
      message: "Password salah",
    },
    { status: 401 }
  );
}

    return NextResponse.json({
  success: true,
  id: user.id,
  role: user.role,
  name: user.name,
});

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}