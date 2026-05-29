"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LaporanAdminPage() {
  const router = useRouter();

  const [namaToko, setNamaToko] = useState("Baru Muncul");
  const [logoToko, setLogoToko] = useState("");

  useEffect(() => {
    const nama = localStorage.getItem("nama_toko");
    const logo = localStorage.getItem("logo_toko");

    if (nama) setNamaToko(nama);
    if (logo) setLogoToko(logo);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* CONTENT */}
      <div className="flex-1 relative overflow-y-auto bg-transparent">

        <div className="p-6">

          {/* HEADER */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.5em] mb-6 shadow">
            Laporan Keuangan
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* PEMASUKAN */}
            <button
              onClick={() =>
                router.push("/admin/laporan_admin/pemasukan")
              }
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition text-left"
            >
              <div className="text-[2.5em] mb-3">
                💰
              </div>

              <div className="font-bold text-[1.2em]">
                Pemasukan
              </div>

              <p className="text-[1em] text-gray-500 mt-1">
                Semua data uang masuk
              </p>
            </button>

            {/* PENGELUARAN */}
            <button
              onClick={() =>
                router.push("/admin/laporan_admin/pengeluaran")
              }
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition text-left"
            >
              <div className="text-[2.5em] mb-3">
                💸
              </div>

              <div className="font-bold text-[1.2em]">
                Pengeluaran
              </div>

              <p className="text-[1em] text-gray-500 mt-1">
                Semua data uang keluar
              </p>
            </button>

            {/* LABA RUGI */}
            <button
              onClick={() =>
                router.push("/admin/laporan_admin/laba_rugi")
              }
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition text-left"
            >
              <div className="text-[2.5em] mb-3">
                📊
              </div>

              <div className="font-bold text-[1.2em]">
                Laba Rugi
              </div>

              <p className="text-[1em] text-gray-500 mt-1">
                Perhitungan keuntungan
              </p>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}