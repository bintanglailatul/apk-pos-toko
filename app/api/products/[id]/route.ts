import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const product = await prisma.products.update({
      where: {
        id: Number(id),
      },

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
      { message: "Gagal update barang" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.products.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Barang berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal hapus barang" },
      { status: 500 }
    );
  }
}