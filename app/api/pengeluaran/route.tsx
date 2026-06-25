import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"
import fs from "fs"

if (!fs.existsSync("public/uploads")) {
  fs.mkdirSync("public/uploads", { recursive: true })
}

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
});

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
    const kategori = formData.get("kategori") as string
    const metode = formData.get("metode") as string
    const supplier = formData.get("supplier") as string
    const jumlah = formData.get("jumlah") as string
    const tanggal = formData.get("tanggal") as string
    const user_input = formData.get("user_input") as string

    // 🔥 FIX USER ID (AMAN DARI "admin" / JSON / string)
    const userId = Number(user_input)

    console.log("USER INPUT:", user_input)
console.log("USER ID:", userId)

    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "User tidak valid" },
        { status: 400 }
      )
    }

    // ================= FILE =================
    const bukti = formData.get("bukti") as File | null

    let buktiPath = null

    if (bukti) {
      const bytes = await bukti.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = Date.now() + "-" + bukti.name

      const filePath = path.join(process.cwd(), "public/uploads", fileName)

      await writeFile(filePath, buffer)

      buktiPath = "/uploads/" + fileName
    }

    // ================= SIMPAN =================
    const result = await prisma.pengeluaran.create({
      data: {
        user_id: userId, // 🔥 SESUAI PRISMA (INT WAJIB)
        keterangan,
        kategori,
        metode,
        supplier,
        jumlah: Number(jumlah.replace(/\D/g, "")),
        tanggal: new Date(tanggal),
        bukti: buktiPath,
      },
    })

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Gagal menyimpan data" },
      { status: 500 }
    )
  }
}