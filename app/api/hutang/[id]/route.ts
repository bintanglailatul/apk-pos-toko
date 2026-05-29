import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
const hutangId = Number(id);

    const body = await req.json();
    const { metode, userId } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "ID tidak valid",
      });
    }

    // ambil data hutang
    const hutang = await prisma.hutang.findUnique({
  where: { id: hutangId },
});

    if (!hutang) {
      return NextResponse.json({
        success: false,
        message: "Hutang tidak ditemukan",
      });
    }

    // update hutang jadi lunas
    const updated = await prisma.hutang.update({
  where: { id: hutangId },
      data: {
        status: "LUNAS",
        metode,
        isLunas: true,
      },
    });

    // 🔥 buat transaksi baru (income)
    await prisma.transactions.create({
      data: {
        total: hutang.total,
        bayar: hutang.total,
        kembali: 0,
        metode,
        user_id: userId ?? hutang.user_id, // fallback aman
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json({
      success: false,
      message: err.message || "Gagal update hutang",
    });
  }
}