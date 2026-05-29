import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.products.findMany();

    const merah = products.filter((p) => {
      const stok = p.stok ?? 0;
      const batasMerah = p.stokMerah ?? 5;

      return stok <= batasMerah;
    });

    return NextResponse.json({
      count: merah.length,
      data: merah,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal ambil notifikasi" },
      { status: 500 }
    );
  }
}