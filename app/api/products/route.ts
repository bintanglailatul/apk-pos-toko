import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal mengambil data barang" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product = await prisma.products.create({
      data: {
        name: body.name,
        harga: Number(body.harga),
        harga_beli: Number(body.harga_beli),
        stok: Number(body.stok),

        // ================= STOK CUSTOM =================
        stokHijau: Number(body.stokHijau),
        stokOrange: Number(body.stokOrange),
        stokMerah: Number(body.stokMerah),

        kategori: body.kategori,
       
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal tambah barang" },
      { status: 500 }
    );
  }
}