"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/useSettings";

type ProdukMerah = {
  id: number;
  name: string;
  stok: number;
  stokMerah?: number;
};

export default function DashboardAdmin() {
  const router = useRouter();
  const settings = useSettings();

  const [periode, setPeriode] = useState("hari");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [stokMerah, setStokMerah] = useState<ProdukMerah[]>([]);

  const [data, setData] = useState({
    totalPenjualan: 0,
    totalPengeluaran: 0,
    labaBersih: 0,
    jumlahTransaksi: 0,
  });

  useEffect(() => {
    if (startDate || endDate) setPeriode("");
  }, [startDate, endDate]);

  useEffect(() => {
    if (periode) {
      setStartDate("");
      setEndDate("");
    }
  }, [periode]);

  const fetchDashboard = async () => {
    try {
      let url = "/api/dashboard";

      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      } else {
        url += `?periode=${periode}`;
      }

      const res = await fetch(url);
      const result = await res.json();

      setData({
        totalPenjualan: result.totalPenjualan || 0,
        totalPengeluaran: result.totalPengeluaran || 0,
        labaBersih: result.labaBersih || 0,
        jumlahTransaksi: result.jumlahTransaksi || 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStokMerah = async () => {
    try {
      const res = await fetch("/api/products");
      const result = await res.json();

      const merah = result.filter(
        (item: ProdukMerah) => item.stok <= (item.stokMerah || 5)
      );

      setStokMerah(merah);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchStokMerah();
  }, [periode, startDate, endDate]);

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID").format(angka);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.5em] mb-6 shadow">
        Dashboard Admin
        <p className="text-gray-300 mt-2 text-[0.7em]">
          Monitoring Penjualan
        </p>
      </div>

      {/* FILTER */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="hari">Hari Ini</option>
            <option value="minggu">Minggu Ini</option>
            <option value="bulan">Bulan Ini</option>
            <option value="tahun">Tahun Ini</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-3 rounded-lg"
          />

        </div>
      </div>

      {/* CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-blue-600">
          <p className="text-gray-500 text-[1em]">Total Penjualan</p>
          <h2 className="text-[2em] font-bold text-blue-600 mt-2">
            Rp {formatRupiah(data.totalPenjualan)}
          </h2>
          <p className="text-[1em] text-gray-400 mt-2">
            {data.jumlahTransaksi} transaksi
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-red-500">
          <p className="text-gray-500 text-[1em] ">Total Pengeluaran</p>
          <h2 className="text-[2em] font-bold  text-red-500 mt-2">
            Rp {formatRupiah(data.totalPengeluaran)}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-[1em]">Laba Bersih</p>
          <h2 className="text-[2em] font-bold text-green-500 mt-2">
            Rp {formatRupiah(data.labaBersih)}
          </h2>
        </div>

      </div>

    </div>
  );
}