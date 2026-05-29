"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/useSettings";

type Pengeluaran = {
  id: number;
  tanggal: string;
  keterangan: string;
  jumlah: number;
};

export default function Page() {
  const router = useRouter();
  const settings = useSettings();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [pemasukan, setPemasukan] = useState(0);
  const [pengeluaran, setPengeluaran] = useState<Pengeluaran[]>([]);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);

  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert("Pilih tanggal dulu!");
      return;
    }

    setLoading(true);

    try {
      const query = `?start=${startDate}&end=${endDate}`;

      const pemasukanRes = await fetch(
        "/api/laporan/pemasukan" + query
      ).then((res) => res.json());

      const pengeluaranRes = await fetch(
        "/api/laporan/pengeluaran" + query
      ).then((res) => res.json());

      setPemasukan(pemasukanRes.total || 0);
      setPengeluaran(pengeluaranRes.data || []);
      setTotalPengeluaran(pengeluaranRes.total || 0);

    } catch (err) {
      console.log(err);
      alert("Gagal mengambil data");
    }

    setLoading(false);
  };

  const labaBersih = pemasukan - totalPengeluaran;

  const format = (n: number) =>
    new Intl.NumberFormat("id-ID").format(n || 0);

  // ================= PRINT =================
  const handlePrint = async () => {
    await fetchData();

    setTimeout(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    }, 500);
  };

  return (
    <div>

      <div className="flex-1 relative print:block print:w-full print:h-auto">

        <div className="p-2">

          {/* HEADER */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.4em] mb-6 shadow relative">

            Laporan Laba Rugi

            <button
              onClick={() => router.push("/admin/laporan_admin")}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 print:hidden"
            >
              ← Kembali
            </button>

          </div>

          {/* FILTER */}
          <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-2xl shadow-md p-5 mb-5 print:hidden">

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="font-semibold block mb-2">
                  Tanggal Awal
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border p-3 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-2">
                  Tanggal Akhir
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border p-3 rounded-xl"
                />
              </div>

            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "MEMUAT..." : "FILTER DATA"}
            </button>

          </div>

          {/* TOTAL CARD */}
          <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-2xl shadow-md p-5 mb-5 print:hidden">

            <div className="flex justify-between items-center flex-wrap gap-5">

              <div className="grid md:grid-cols-3 gap-4 flex-1">

                <div>
                  <p className="text-gray-500">
                    Total Pendapatan
                  </p>

                  <h1 className="text-2xl font-bold text-green-600 mt-1">
                    Rp {format(pemasukan)}
                  </h1>
                </div>

                <div>
                  <p className="text-gray-500">
                    Total Biaya
                  </p>

                  <h1 className="text-2xl font-bold text-red-600 mt-1">
                    Rp {format(totalPengeluaran)}
                  </h1>
                </div>

                <div>
                  <p className="text-gray-500">
                    Laba Bersih
                  </p>

                  <h1
                    className={`text-2xl font-bold mt-1 ${
                      labaBersih >= 0
                        ? "text-blue-700"
                        : "text-red-700"
                    }`}
                  >
                    Rp {format(labaBersih)}
                  </h1>
                </div>

              </div>

              <button
                onClick={handlePrint}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold"
              >
                CETAK LAPORAN
              </button>

            </div>

          </div>

          {/* TABLE */}
          <div className="print-a4">

            <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-2xl shadow-md p-6
print:rounded-none print:shadow-none print:border-black print:p-0 print:bg-white print:w-full">

              {/* HEADER PRINT */}
              <div className="text-center pb-3 mb-4">

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
                    LAPORAN LABA RUGI
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Periode {startDate || "-"} s/d {endDate || "-"}
                  </p>

                </div>

              </div>

              {/* TABLE LABA RUGI */}
              <table className="w-full border-collapse">

                <tbody>

                  {/* PENDAPATAN */}
                  <tr className="bg-gray-100 font-bold">
                    <td
                      colSpan={2}
                      className="border p-3 uppercase"
                    >
                      Pendapatan
                    </td>
                  </tr>

                  <tr>
                    <td className="border p-3">
                      Penjualan
                    </td>

                    <td className="border p-3 text-right font-semibold text-green-700">
                      Rp {format(pemasukan)}
                    </td>
                  </tr>

                  <tr className="bg-gray-50 font-bold">

                    <td className="border p-3 text-right">
                      Total Pendapatan
                    </td>

                    <td className="border p-3 text-right text-green-700">
                      Rp {format(pemasukan)}
                    </td>

                  </tr>

                  {/* SPASI */}
                  <tr>
                    <td className="border p-2 bg-white"></td>
                    <td className="border p-2 bg-white"></td>
                  </tr>

                  {/* BEBAN */}
                  <tr className="bg-gray-100 font-bold">
                    <td
                      colSpan={2}
                      className="border p-3 uppercase"
                    >
                      Beban / Pengeluaran
                    </td>
                  </tr>

                  {pengeluaran.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="border p-6 text-center text-gray-500"
                      >
                        Tidak ada data pengeluaran
                      </td>
                    </tr>
                  ) : (
                    <>
                      {pengeluaran.map((item) => (
                        <tr key={item.id}>

                          <td className="border p-3">
                            {item.keterangan}
                          </td>

                          <td className="border p-3 text-right text-red-600">
                            Rp {format(item.jumlah)}
                          </td>

                        </tr>
                      ))}

                      <tr className="bg-gray-50 font-bold">

                        <td className="border p-3 text-right">
                          Total Biaya
                        </td>

                        <td className="border p-3 text-right text-red-700">
                          Rp {format(totalPengeluaran)}
                        </td>

                      </tr>
                    </>
                  )}

                  {/* LABA */}
                  <tr className="bg-slate-900 text-white font-bold text-lg">

                    <td className="border p-4 uppercase">
                      LABA BERSIH
                    </td>

                    <td className="border p-4 text-right">
                      Rp {format(labaBersih)}
                    </td>

                  </tr>

                </tbody>

              </table>

              {/* FOOTER */}
              <div className="mt-16 flex justify-end">

                <div className="text-center">

                  <p>
                    {new Date().toLocaleDateString("id-ID")}
                  </p>

                  <div className="h-20"></div>

                  <p className="font-semibold">
                    ___________________
                  </p>

                  <p>Admin</p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}