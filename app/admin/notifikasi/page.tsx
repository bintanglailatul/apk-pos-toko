"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/useSettings";

type Produk = {
  id: number;
  name: string;
  stok: number;
  stokMerah?: number;
};

export default function NotifikasiAdmin() {
  const router = useRouter();
  const settings = useSettings();

  const [barangMerah, setBarangMerah] = useState<Produk[]>([]);
  const [search, setSearch] = useState("");

  // ================= FONT GLOBAL =================
  const fontSizeClass =
    settings?.globalFontSize === "kecil"
      ? "text-[13px]"
      : settings?.globalFontSize === "besar"
      ? "text-[16px]"
      : "text-[14px]";

  // ================= FETCH =================
  const fetchBarang = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      const merah = data.filter((item: Produk) => {
        const batasMerah = item.stokMerah ?? 5;
        return item.stok <= batasMerah;
      });

      setBarangMerah(merah);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  // ================= PRINT =================
  const handlePrint = async () => {
    await fetchBarang();

    setTimeout(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    }, 500);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${fontSizeClass}`}>

      {/* CONTENT */}
      <div className="flex-1 relative print:block print:w-full print:h-auto">

        <div className="p-2">

          {/* HEADER */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.4em] mb-6 shadow relative print:hidden">
            Notifikasi Stok Barang
          </div>

          {/* INFO CARD */}
          <div className="bg-white/90 rounded-2xl p-5 shadow-xl mb-4 print:hidden">

            <h2 className="text-[1.5em] font-bold text-red-600">
              {barangMerah.length}
            </h2>

            <p className="text-[1em] text-red-700 mt-2">
              Total Barang Stok Kritis
            </p>

          </div>

          {/* ACTION */}
          <div className="text-[1em] flex flex-col md:flex-row gap-3 mb-4 print:hidden">

            <input
              type="text"
              placeholder="Cari barang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-3 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              onClick={handlePrint}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-2xl font-semibold shadow"
            >
              CETAK LAPORAN
            </button>

          </div>

          {/* TABLE AREA */}
          <div className="print-a4">

            <div
              className="
                bg-white/95
                backdrop-blur-xl
                border
                border-white/20
                rounded-2xl
                shadow-xl
                overflow-hidden

                print:rounded-none
                print:shadow-none
                print:border-black
                print:bg-white
              "
            >

              {/* HEADER PRINT ONLY */}
              <div className="hidden print:block text-center pb-3 mb-4 p-6">

                <h1 className="text-2xl font-bold uppercase">
                  {settings?.namaToko || "BARU MUNCUL"}
                </h1>

                <p className="text-gray-600 mt-1">
                  {settings?.alamat || "Alamat Toko"}
                </p>

                <p className="text-gray-600">
                  {settings?.telepon || "No. Telepon"}
                </p>

                <div className="mt-4">

                  <h2 className="text-xl font-bold">
                    LAPORAN NOTIFIKASI STOK
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Barang dengan stok kritis
                  </p>

                </div>

              </div>

              {/* TABLE */}
              <table className="w-full border-collapse">

                {/* HEADER */}
                <thead className="bg-gray-900 text-white">
                  <tr className="print:break-inside-avoid print:break-after-avoid">

                    <th className="p-3 border border-gray-700">
                      No
                    </th>

                    <th className="p-3 border border-gray-700 text-left">
                      Nama Barang
                    </th>

                    <th className="p-3 border border-gray-700 text-center">
                      Stok
                    </th>

                    <th className="p-3 border border-gray-700 text-center">
                      Batas Minimum
                    </th>

                    <th className="p-3 border border-gray-700 text-center">
                      Status
                    </th>

                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {barangMerah
                    .filter((item) =>
                      item.name
                        ?.toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .length > 0 ? (
                    barangMerah
                      .filter((item) =>
                        item.name
                          ?.toLowerCase()
                          .includes(search.toLowerCase())
                      )
                      .map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-100 transition"
                        >

                          <td className="p-3 border text-center">
                            {index + 1}
                          </td>

                          <td className="p-3 border">
                            {item.name}
                          </td>

                          <td className="p-3 border text-center font-bold text-red-600">
                            {item.stok}
                          </td>

                          <td className="p-3 border text-center">
                            {item.stokMerah ?? 5}
                          </td>

                          <td className="p-3 border text-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-xl text-sm font-semibold print:bg-transparent print:text-black print:p-0">
                              STOK KRITIS
                            </span>
                          </td>

                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center p-10 text-green-700 font-bold"
                      >
                        Semua stok aman
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}