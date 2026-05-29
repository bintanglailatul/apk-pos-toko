/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Hutang` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hutang" DROP COLUMN "updatedAt",
ADD COLUMN     "metode" TEXT,
ALTER COLUMN "cart" DROP NOT NULL;
