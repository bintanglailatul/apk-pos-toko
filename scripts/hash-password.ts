import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function run() {
  const users = await prisma.users.findMany();

  for (const user of users) {
    // skip kalau password kosong
    if (!user.password) continue;

    // skip kalau sudah hash bcrypt
    if (user.password.startsWith("$2a")) continue;

    // hash password
    const hashed = await bcrypt.hash(user.password, 10);

    // update database
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashed,
      },
    });
  }

  console.log("✅ SEMUA PASSWORD SUDAH DI-HASH");

  await prisma.$disconnect();
}

run();