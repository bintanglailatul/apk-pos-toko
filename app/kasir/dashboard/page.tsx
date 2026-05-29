"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardAdmin() {

  const router = useRouter();

  // ================= IDENTITAS TOKO =================
  const [namaToko, setNamaToko] = useState("Baru Muncul");
  const [logoToko, setLogoToko] = useState("");

  // ================= DATA =================
  const [data, setData] = useState({
    totalPenjualan: 0,
    jumlahTransaksi: 0,
  });

  // ================= LOAD LOCAL STORAGE =================
  useEffect(() => {

    const nama = localStorage.getItem("nama_toko");
    const logo = localStorage.getItem("logo_toko");

    if (nama) setNamaToko(nama);
    if (logo) setLogoToko(logo);

  }, []);

  // ================= FETCH DASHBOARD =================
  const fetchDashboard = async () => {

    try {

      // HANYA HARI INI
      const res = await fetch("/api/dashboard?periode=hari");
      const result = await res.json();

      setData({
        totalPenjualan: result.totalPenjualan || 0,
        jumlahTransaksi: result.jumlahTransaksi || 0,
      });

    } catch (error) {

      console.log(error);

      setData({
        totalPenjualan: 0,
        jumlahTransaksi: 0,
      });

    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  return (
  <div className="h-full overflow-y-auto p-3 bg-transparent">

    {/* HEADER */}
    <div className="text-center mb-6">

      <div className="bg-slate-900 p-6 rounded-2xl text-white font-bold text-[1.5em] shadow">
        Dashboard Kasir

        <p className="text-gray-300 font-semibold text-[0.7em] mt-2">
          Total Transaksi Dan Penjualan Hari Ini
        </p>
      </div>

    </div>

    {/* CARD */}
    <div className="flex flex-col items-center gap-6">

      {/* TOTAL TRANSAKSI */}
      <div className="bg-white/95 backdrop-blur-md w-full max-w-2xl rounded-3xl shadow-xl border-l-8 border-green-500 p-7">

        <p className="text-gray-500 text-[1em] text-center font-medium">
          Total Transaksi
        </p>

        <h2 className="text-[3em] font-bold text-green-600 mt-3 text-center">
          {data.jumlahTransaksi}
        </h2>

      </div>

      {/* TOTAL PENJUALAN */}
      <div className="bg-white/95 backdrop-blur-md w-full max-w-2xl rounded-3xl shadow-xl border-l-8 border-blue-600 p-7">

        <p className="text-gray-500 text-[1em] text-center font-medium">
          Total Penjualan
        </p>

        <h2 className="text-[3em] font-bold text-blue-700 mt-3 text-center">
          Rp {formatRupiah(data.totalPenjualan)}
        </h2>

      </div>

    </div>

  </div>
);
}