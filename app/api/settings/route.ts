import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET
export async function GET() {
  const data = await prisma.setting.findUnique({
    where: { id: 1 },
  })

  return NextResponse.json(data)
}

// PUT
export async function PUT(req: Request) {
  const body = await req.json();

  const {
    namaToko,
    logoToko,
    alamat,
    telepon,
    tagline,
    footerStruk,
    strukFontSize,
    kasirBackgroundImage,
    kasirBackgroundOpacity,
    kasirBackgroundColor,
    adminBackgroundImage,
    adminBackgroundOpacity,
    adminBackgroundColor,
    stokGreenLimit,
    stokOrangeLimit,
    stokRedLimit,
    stokGreenColor,
    stokOrangeColor,
    stokRedColor,
    kasirFontSize,
    adminFontSize,
  } = body;

  const data = await prisma.setting.upsert({
    where: { id: 1 },
    update: {
      namaToko,
      logoToko,
      alamat,
      telepon,
      tagline,
      footerStruk,
      strukFontSize,
      adminBackgroundImage,
      adminBackgroundOpacity,
      adminBackgroundColor,
      kasirBackgroundImage,
      kasirBackgroundOpacity,
      kasirBackgroundColor,
      stokGreenLimit,
      stokOrangeLimit,
      stokRedLimit,
      stokGreenColor,
      stokOrangeColor,
      stokRedColor,
      adminFontSize,
      kasirFontSize,
    },
    create: {
      id: 1,
      namaToko,
      logoToko,
      alamat,
      telepon,
      tagline,
      footerStruk,
      strukFontSize,
      adminBackgroundImage,
      adminBackgroundOpacity,
      adminBackgroundColor,
      kasirBackgroundImage,
      kasirBackgroundOpacity,
      kasirBackgroundColor,
      stokGreenLimit,
      stokOrangeLimit,
      stokRedLimit,
      stokGreenColor,
      stokOrangeColor,
      stokRedColor,
      adminFontSize,
      kasirFontSize,
    },
  });

  return NextResponse.json(data);
}