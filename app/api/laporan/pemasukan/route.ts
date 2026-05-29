import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const start = searchParams.get("start");
    const end = searchParams.get("end");

    let where: any = undefined;

    if (start && end) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);

      where = {
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const data = await prisma.transactions.findMany({
      where,
      orderBy: { tanggal: "desc" },
    });

    const total = data.reduce(
      (sum, item) => sum + (Number(item.total) || 0),
      0
    );

    return Response.json({ data, total });

  } catch (error) {
    console.error("LAPORAN PEMASUKAN ERROR:", error);

    return Response.json({ data: [], total: 0 }, { status: 200 });
  }
}