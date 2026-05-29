import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      cart,
      total,
      bayar,
      kembali,
      metode,
      userId,
      namaPelanggan
    } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Keranjang kosong",
      });
    }
// VALIDASI USER
if (!userId) {
  return NextResponse.json({
    success: false,
    message: "User tidak valid",
  });
}

// ================= HUTANG =================
if (metode === "HUTANG") {

  const hutang = await prisma.hutang.create({
  data: {
    namaPelanggan,
    total: Number(total),
    bayar: 0,
    kembali: 0,
    status: "HUTANG",
    metode: "HUTANG",
    cart: cart,
    user_id: userId, // WAJIB
  },
});

  return NextResponse.json({
    success: true,
    hutangId: hutang.id,
    message: "Hutang berhasil disimpan",
  });
}

const result = await prisma.$transaction(async (tx) => {

  const transaksi = await tx.transactions.create({
  data: {
    total: Number(total),
    bayar: Number(bayar),
    kembali: Number(kembali),
    metode,
    user_id: userId,
    tanggal: new Date(), // 🔥 TAMBAHKAN DI SINI
  },
});

  for (const item of cart) {

    // ================= JASA =================
    if (item.isJasa) {

  await tx.transaction_details.create({
  data: {
    transaction_id: transaksi.id,
    product_id: undefined, // FIX FINAL
    nama_produk: item.nama,
    type: "JASA",
    qty: item.qty,
    harga: item.harga,
  },
});
      continue;
    }

    const product = await tx.products.findUnique({
      where: { id: item.id },
    });

    if (!product) {
      throw new Error(`Produk ${item.nama} tidak ditemukan`);
    }

    if ((product.stok ?? 0) < item.qty) {
      throw new Error(`Stok tidak cukup untuk ${item.nama}`);
    }

    await tx.transaction_details.create({
  data: {
    transaction_id: transaksi.id,
    product_id: item.id,
    nama_produk: item.nama,
    type: "BARANG",
    qty: item.qty,
    harga: item.harga,
  },
});
    await tx.products.update({
      where: { id: item.id },
      data: {
        stok: {
          decrement: item.qty,
        },
      },
    });
  }

  return transaksi;
});

    return NextResponse.json({
      success: true,
      transaksiId: result.id,
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json({
      success: false,
      message: error.message || "Terjadi kesalahan",
    });
  }
}