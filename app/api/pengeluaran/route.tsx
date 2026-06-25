import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadToDrive } from "@/lib/googleDrive"

// ================= GET =================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filter: any = {}

    if (startDate && endDate) {
      filter.tanggal = {
        gte: new Date(startDate),
        lte: new Date(endDate),
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
    })

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    )
  }
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const keterangan = formData.get("keterangan") as string
    const kategori   = formData.get("kategori")   as string
    const metode     = formData.get("metode")      as string
    const supplier   = formData.get("supplier")    as string
    const jumlah     = formData.get("jumlah")      as string
    const tanggal    = formData.get("tanggal")     as string
    const user_input = formData.get("user_input")  as string

    const userId = Number(user_input)

    // 🔍 DEBUG LOG
    console.log("=== DEBUG PENGELUARAN ===")
    console.log("userId:", userId)
    console.log("keterangan:", keterangan)
    console.log("EMAIL:", process.env.GOOGLE_CLIENT_EMAIL)
    console.log("FOLDER:", process.env.GOOGLE_DRIVE_FOLDER_ID)
    console.log("KEY ada?:", !!process.env.GOOGLE_PRIVATE_KEY)
    console.log("KEY awal:", process.env.GOOGLE_PRIVATE_KEY?.substring(0, 50))
    console.log("DATABASE_URL ada?:", !!process.env.DATABASE_URL)

    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "User tidak valid" },
        { status: 400 }
      )
    }

    // ================= FILE → GOOGLE DRIVE =================
    const buktiFile = formData.get("bukti") as File | null
    let buktiUrl: string | null = null

    if (buktiFile && buktiFile.size > 0) {
      try {
        const bytes    = await buktiFile.arrayBuffer()
        const buffer   = Buffer.from(bytes)
        const fileName = `bukti-${Date.now()}-${buktiFile.name}`

        buktiUrl = await uploadToDrive(buffer, fileName, buktiFile.type)
        console.log("Upload berhasil:", buktiUrl)

      } catch (uploadError) {
        // ✅ Kalau upload foto gagal, data tetap disimpan tanpa bukti
        console.error("Upload Drive gagal:", uploadError)
        buktiUrl = null
      }
    }

    // ================= SIMPAN KE DATABASE =================
    const result = await prisma.pengeluaran.create({
      data: {
        user_id:    userId,
        keterangan,
        kategori,
        metode,
        supplier,
        jumlah:  Number(jumlah.replace(/\D/g, "")),
        tanggal: new Date(tanggal),
        bukti:   buktiUrl,
      },
    })

    console.log("Simpan berhasil, id:", result.id)

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    console.error("ERROR PENGELUARAN:", error)

    return NextResponse.json(
      { message: "Gagal menyimpan data" },
      { status: 500 }
    )
  }
}