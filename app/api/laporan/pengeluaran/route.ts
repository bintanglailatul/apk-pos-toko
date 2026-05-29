import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= GET =================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // 🔥 FIX: SAMAKAN DENGAN FRONTEND (start & end)
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    let filter: any = {};

    // ================= FILTER TANGGAL =================
    if (start && end) {
  const startDate = new Date(start)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(end)
  endDate.setHours(23, 59, 59, 999)

  filter.tanggal = {
    gte: startDate,
    lte: endDate,
  }
}

    const data = await prisma.pengeluaran.findMany({
  where: filter,

  include: {
    users: {
      select: {
        id: true,
        name: true,
        role: true,
      },
    },
  },

  orderBy: {
    tanggal: "desc",
  },
});

    // TOTAL
    const total = data.reduce(
      (sum, item) => sum + (item.jumlah || 0),
      0
    );

    return NextResponse.json({
      data,
      total,
    });

  } catch (error) {
    console.error("ERROR LAPORAN PENGELUARAN:", error);

    return NextResponse.json(
      {
        data: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}