import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ================= EDIT USER =================
export async function PUT(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const body = await req.json();

    const { id } = await context.params;

    const userId = parseInt(id);

    // ================= USER LAMA =================
    const oldUser = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!oldUser) {
      return NextResponse.json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // ================= CEK TOTAL ROLE =================
    const totalRole = await prisma.users.count({
      where: {
        role: oldUser.role,
      },
    });

    // ================= VALIDASI ROLE =================
    // kalau role tinggal 1 maka role tidak boleh diganti
    if (
      totalRole <= 1 &&
      body.role !== oldUser.role
    ) {
      return NextResponse.json({
        success: false,
        message:
          `Minimal harus ada 1 ${oldUser.role}`,
      });
    }

    // ================= DATA UPDATE =================
    let dataUpdate: any = {
      name: body.name,
      email: body.email,
      role: body.role,
    };

    // ================= PASSWORD =================
    if (body.password) {
      const hashed = await bcrypt.hash(
        body.password,
        10
      );

      dataUpdate.password = hashed;
    }

    // ================= UPDATE =================
    const updateUser = await prisma.users.update({
      where: {
        id: userId,
      },

      data: dataUpdate,
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil diupdate",
      data: updateUser,
    });

  } catch (error) {
    console.log("ERROR EDIT:", error);

    return NextResponse.json({
      success: false,
      message: "Gagal update user",
    });
  }
}

// ================= DELETE USER =================
export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    const totalRole = await prisma.users.count({
      where: { role: user.role }
    });

    // ❗ rule minimal 1 user per role
    if (totalRole <= 1) {
      return NextResponse.json({
        success: false,
        message: `Minimal harus ada 1 ${user.role}`
      });
    }

    // ❌ TIDAK HAPUS HISTORI
    await prisma.users.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus"
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Gagal hapus user"
    });
  }
}