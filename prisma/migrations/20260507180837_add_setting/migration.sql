-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "namaToko" TEXT NOT NULL DEFAULT 'Toko Saya',
    "backgroundAdmin" TEXT NOT NULL DEFAULT '#0f172a',
    "backgroundKasir" TEXT NOT NULL DEFAULT '#f3f4f6',
    "fontSizeAdmin" TEXT NOT NULL DEFAULT 'medium',
    "fontSizeKasir" TEXT NOT NULL DEFAULT 'medium',
    "strukTemplate" TEXT NOT NULL DEFAULT 'Terima kasih telah berbelanja',
    "stokMinimum" INTEGER NOT NULL DEFAULT 5,
    "stokWarningColor" TEXT NOT NULL DEFAULT '#ef4444',

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
