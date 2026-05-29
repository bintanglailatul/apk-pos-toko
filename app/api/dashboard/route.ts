import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const periode = searchParams.get("periode");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // =========================
    // DEFAULT (HARI INI)
    // =========================
    let start = new Date();
    start.setHours(0, 0, 0, 0);

    let end = new Date();
    end.setHours(23, 59, 59, 999);

    // =========================
    // FILTER PERIODE
    // =========================
    if (periode) {
      const now = new Date();

      if (periode === "hari") {
        start = new Date();
        start.setHours(0, 0, 0, 0);

        end = new Date();
        end.setHours(23, 59, 59, 999);
      }

      else if (periode === "minggu") {
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        start.setHours(0, 0, 0, 0);

        end = new Date();
        end.setHours(23, 59, 59, 999);
      }

      else if (periode === "bulan") {
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        start.setHours(0, 0, 0, 0);

        end = new Date();
        end.setHours(23, 59, 59, 999);
      }

      else if (periode === "tahun") {
        start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        start.setHours(0, 0, 0, 0);

        end = new Date();
        end.setHours(23, 59, 59, 999);
      }
    }

    // =========================
    // FILTER CUSTOM DATE
    // =========================
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    // =========================
    // DEBUG DATA (WAJIB SAAT ERROR)
    // =========================
    const cekTransaksi = await prisma.transactions.findMany();
    const cekPengeluaran = await prisma.pengeluaran.findMany();

    console.log("ISI TRANSAKSI:", cekTransaksi);
    console.log("ISI PENGELUARAN:", cekPengeluaran);

    // =========================
    // TOTAL PENJUALAN
    // =========================
    const totalPenjualanData = await prisma.transactions.aggregate({
      _sum: {
        total: true,
      },
     where: {
  tanggal: {
    gte: start,
    lte: end,
  },
}});

    // =========================
    // TOTAL PENGELUARAN
    // =========================
    const totalPengeluaranData = await prisma.pengeluaran.aggregate({
      _sum: {
        jumlah: true,
      },
      where: {
  tanggal: {
    gte: start,
    lte: end,
  },
}});

    // =========================
    // JUMLAH TRANSAKSI
    // =========================
    const jumlahTransaksi = await prisma.transactions.count({
      where: {
  tanggal: {
    gte: start,
    lte: end,
  },
}});

    // =========================
    // AMBIL NILAI (ANTI NULL)
    // =========================
    const totalPenjualan = totalPenjualanData._sum.total ?? 0;
    const totalPengeluaran = totalPengeluaranData._sum.jumlah ?? 0;

    const labaBersih = totalPenjualan - totalPengeluaran;

    // =========================
    // DEBUG HASIL
    // =========================
    console.log("START:", start);
    console.log("END:", end);
    console.log("TOTAL PENJUALAN:", totalPenjualan);
    console.log("TOTAL PENGELUARAN:", totalPengeluaran);
    console.log("LABA:", labaBersih);

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json({
      totalPenjualan,
      totalPengeluaran,
      labaBersih,
      jumlahTransaksi,
      totalPemasukan: totalPenjualan,
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        totalPenjualan: 0,
        totalPengeluaran: 0,
        labaBersih: 0,
        jumlahTransaksi: 0,
        totalPemasukan: 0,
      },
      { status: 500 }
    );
  }
}