import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { startDate, endDate, userId } = await req.json()

    // VALIDASI
    if (!startDate || !endDate || userId == null) {
      return NextResponse.json({
        success: false,
        message: "Data tidak lengkap"
      })
    }

    // FORMAT TANGGAL
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    // CEK DUPLIKAT
    const existing = await prisma.laporan.findFirst({
      where: {
        tanggal_mulai: start,
        tanggal_selesai: end
      }
    })

    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Laporan sudah ada!"
      })
    }

    // AMBIL TRANSAKSI
    const transaksi = await prisma.transactions.findMany({
      where: {
        tanggal: {
          gte: start,
          lte: end
        }
      },
      include: {
        transaction_details: {
          include: {
            products: true
          }
        }
      }
    })

    // AMBIL PENGELUARAN
    const pengeluaran = await prisma.pengeluaran.findMany({
      where: {
        tanggal: {
          gte: start,
          lte: end
        }
      }
    })

    // HITUNG
    let totalPemasukan = 0
    let totalModal = 0

    transaksi.forEach(t => {
      totalPemasukan += t.total || 0

      t.transaction_details.forEach(d => {
        totalModal +=
          (d.products?.harga_beli || 0) *
          (d.qty || 0)
      })
    })

    const totalPengeluaran = pengeluaran.reduce(
      (acc, p) => acc + (p.jumlah || 0),
      0
    )

    const labaBersih =
      totalPemasukan - totalModal - totalPengeluaran

    // SIMPAN
    const laporan = await prisma.laporan.create({
      data: {
        tanggal_mulai: start,
        tanggal_selesai: end,

        total_pemasukan: totalPemasukan,
        total_pengeluaran: totalPengeluaran,
        total_modal: totalModal,
        laba_bersih: labaBersih,

        user_id: userId
      }
    })

    return NextResponse.json({
      success: true,
      data: laporan
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json({
      success: false,
      message: "Gagal generate laporan"
    })
  }
}

// ================= GET HISTORI =================
export async function GET() {
  const data = await prisma.laporan.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })

  return NextResponse.json(data)
}