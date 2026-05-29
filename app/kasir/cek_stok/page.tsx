"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  harga: number;
  stok: number;

  stokHijau?: number;
  stokOrange?: number;
  stokMerah?: number;

  minStokOverride?: number;
};

export default function StokPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState<any>(null);

  // FETCH DATA DARI DATABASE
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Gagal ambil data barang:", error);
    }
  };

  useEffect(() => {
  fetchProducts();


  fetch("/api/settings")
    .then(res => res.json())
    .then(data => setSettings(data))
}, [])

  // STATUS STOK
const getStatus = (
  stok: number,
  merah: number = 5,
  orange: number = 10
) => {
  if (stok <= merah) {
    return {
      text: "Hampir Habis",
      color: "bg-red-500 text-white",
    };
  }

  if (stok <= orange) {
    return {
      text: "Menipis",
      color: "bg-orange-400 text-white",
    };
  }

  return {
    text: "Aman",
    color: "bg-green-500 text-white",
  };
};

  // FILTER SEARCH
  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

return (
  <div className="flex h-screen overflow-hidden">

    {/* ================= CONTENT ================= */}
    <div className="flex-1 h-screen overflow-hidden relative">

      <div className="relative z-10 h-full flex flex-col p-2">

        {/* HEADER */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.5em] mb-6 shadow">
          Stok Barang
        </div>

        {/* SEARCH */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl border bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ================= TABLE WRAPPER ================= */}
        <div className="flex-1 overflow-hidden">

          {/* SCROLL AREA */}
          <div className="h-full overflow-y-auto rounded-xl">

            {/* TABLE CARD */}
            <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-xl shadow-md overflow-hidden">

              <table className="w-full">

                {/* HEADER */}
                <thead className="bg-gray-900 text-white sticky top-0 z-10">

                  <tr>
                    <th className="p-3 border border-gray-700 text-center w-16">
                      No
                    </th>

                    <th className="p-3 border border-gray-700">
                      Nama Barang
                    </th>

                    <th className="p-3 border border-gray-700 text-center">
                      Harga
                    </th>

                    <th className="p-3 border border-gray-700 text-center">
                      Stok
                    </th>

                    <th className="p-3 border border-gray-700 text-center">
                      Status
                    </th>
                  </tr>

                </thead>

                {/* BODY */}
                <tbody>

                  {filtered.length > 0 ? (

                    filtered.map((item, index) => {

                      const status = getStatus(
                        item.stok,
                        item.stokMerah ?? 5,
                        item.stokOrange ?? 10
                      )

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-100 transition"
                        >

                          {/* NO */}
                          <td className="p-3 border border-gray-300 text-center">
                            {index + 1}
                          </td>

                          {/* NAMA */}
                          <td className="p-3 border border-gray-300">
                            {item.name}
                          </td>

                          {/* HARGA */}
                          <td className="p-3 border border-gray-300 text-center">
                            Rp{" "}
                            {new Intl.NumberFormat("id-ID").format(
                              item.harga
                            )}
                          </td>

                          {/* STOK */}
                          <td
                            className={`p-3 border border-gray-300 text-center font-bold ${
                              item.stok <= (item.stokMerah || 5)
                                ? "bg-red-600 text-white"
                                : item.stok <= (item.stokOrange || 10)
                                ? "bg-orange-500 text-white"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {item.stok}
                          </td>

                          {/* STATUS */}
                          <td className="p-3 border border-gray-300 text-center">

                            <span
                              className={`px-3 py-1 rounded-lg font-semibold ${status.color}`}
                            >
                              {status.text}
                            </span>

                          </td>

                        </tr>
                      )
                    })

                  ) : (

                    <tr>

                      <td
                        colSpan={5}
                        className="text-center p-6 text-gray-500"
                      >
                        Barang tidak ditemukan
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

  </div>
);
}