import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= GET =================
export async function GET() {
  const data = await prisma.hutang.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(data);
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      namaPelanggan,
      cart,
      total,
      bayar,
      kembali,
      userId,
    } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User tidak valid",
      });
    }

    // 🔥 CEK HUTANG BELUM LUNAS
    const existing = await prisma.hutang.findFirst({
      where: {
        namaPelanggan: {
          equals: namaPelanggan,
          mode: "insensitive",
        },
        isLunas: false,
      },
    });

    // ================= UPDATE =================
    if (existing) {
      const updated = await prisma.hutang.update({
        where: { id: existing.id },
        data: {
          total: existing.total + Number(total),
          cart,
          bayar: 0,
          kembali: 0,
        },
      });

      return NextResponse.json({
        success: true,
        data: updated,
      });
    }

    // ================= CREATE =================
    const hutang = await prisma.hutang.create({
      data: {
        namaPelanggan,
        cart,
        total: Number(total),
        bayar: Number(bayar),
        kembali: Number(kembali),
        status: "HUTANG",
        isLunas: false,
        user_id: userId,
      },
    });

    return NextResponse.json({
      success: true,
      data: hutang,
    });

  } catch (err: any) {
    console.log(err);

    return NextResponse.json({
      success: false,
      message: err.message || "Gagal simpan hutang",
    });
  }
}