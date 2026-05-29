-- CreateTable
CREATE TABLE "Hutang" (
    "id" SERIAL NOT NULL,
    "namaPelanggan" TEXT NOT NULL,
    "cart" JSONB NOT NULL,
    "total" INTEGER NOT NULL,
    "bayar" INTEGER NOT NULL DEFAULT 0,
    "kembali" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'HUTANG',
    "isLunas" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hutang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengeluaran" (
    "id" SERIAL NOT NULL,
    "keterangan" TEXT,
    "kategori" TEXT,
    "metode" TEXT,
    "supplier" TEXT,
    "bukti" TEXT,
    "jumlah" INTEGER,
    "tanggal" DATE,
    "user_input" VARCHAR(100),

    CONSTRAINT "pengeluaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "harga" INTEGER,
    "harga_beli" INTEGER,
    "stok" INTEGER DEFAULT 0,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_details" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER,
    "product_id" INTEGER,
    "qty" INTEGER,
    "harga" INTEGER,

    CONSTRAINT "transaction_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total" INTEGER,
    "bayar" INTEGER,
    "kembali" INTEGER,
    "metode" VARCHAR(20),
    "user_id" INTEGER,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(100),
    "password" TEXT,
    "role" VARCHAR(20) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "transaction_details" ADD CONSTRAINT "transaction_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction_details" ADD CONSTRAINT "transaction_details_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
