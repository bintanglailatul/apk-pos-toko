"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/useSettings";

type Pemasukan = {
  id: number;
  tanggal: string;
  metode: string;
  total: number;
};

export default function Page() {
  const router = useRouter();
  const settings = useSettings();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [data, setData] = useState<Pemasukan[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [readyPrint, setReadyPrint] = useState(false);

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);

    let url = "/api/laporan/pemasukan";

    if (startDate && endDate) {
      url += `?start=${startDate}&end=${endDate}`;
    }

    const res = await fetch(url);
    const json = await res.json();

    setData(json.data || []);
    setTotal(json.total || 0);

    setLoading(false);

    return json;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const format = (n: number) =>
    new Intl.NumberFormat("id-ID").format(n || 0);

  // ================= PRINT =================
  const handlePrint = async () => {
    const result = await fetchData();

    if (!result?.data) return;

    setReadyPrint(true);

    setTimeout(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    }, 500);
  };

  return (
    <div>

      {/* CONTENT */}
      <div className="flex-1 relative print:block print:w-full print:h-auto">

        <div className="p-2">

          {/* HEADER */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.4em] mb-6 shadow relative">
            Laporan Pemasukan

            <button
              onClick={() => router.push("/admin/laporan_admin")}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200"
            >
              ← Kembali
            </button>
          </div>

          {/* FILTER */}
          <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-2xl shadow-md p-5 mb-5">

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
              className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-xl font-semibold"
            >
              FILTER DATA
            </button>

          </div>

          {/* TOTAL */}
          <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-2xl shadow-md p-5 mb-5">

            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500">
                  Total Pemasukan
                </p>

                <h1 className="text-3xl font-bold text-green-600 mt-1">
                  Rp {format(total)}
                </h1>
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
                    LAPORAN PEMASUKAN
                  </h2>

                  <p className="text-gray-500 mt-1 border-0">
                    Periode {startDate || "-"} s/d {endDate || "-"}
                  </p>

                </div>

              </div>

              {/* TABLE */}
              <table className="w-full border-collapse">

                <thead className="bg-gray-900 text-white">
                  <tr className="print:break-inside-avoid print:break-after-avoid">
                    <th className="p-3 border border-gray-700">No</th>
                    <th className="p-3 border border-gray-700">Tanggal</th>
                    <th className="p-3 border border-gray-700">No Transaksi</th>
                    <th className="p-3 border border-gray-700">Metode</th>
                    <th className="p-3 border border-gray-700">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-6 text-gray-400">
                        Belum ada data pemasukan
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-100 transition"
                      >

                        <td className="p-3 border text-center">
                          {index + 1}
                        </td>

                        <td className="p-3 border text-center">
                          {new Date(item.tanggal).toLocaleDateString("id-ID")}
                        </td>

                        <td className="p-3 border text-center">
                          TRX-{item.id}
                        </td>

                        <td className="p-3 border text-center capitalize">
                          {item.metode || "-"}
                        </td>

                        <td className="p-3 border text-center font-semibold text-green-600">
                          Rp {format(item.total)}
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>

                {/* TOTAL */}
                {data.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan={4}
                        className="border p-3 text-right"
                      >
                        TOTAL
                      </td>

                      <td className="border p-3 text-center text-green-700">
                        Rp {format(total)}
                      </td>
                    </tr>
                  </tfoot>
                )}

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}