'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/lib/useSettings'

type Hutang = {
  id: number
  namaPelanggan: string
  total: number
  status: string
  createdAt: string
}

export default function HutangAdminPage() {
  const router = useRouter()
  const settings = useSettings()

  const [namaToko, setNamaToko] = useState('Baru Muncul')
  const [logoToko, setLogoToko] = useState('')

  const [dataHutang, setDataHutang] = useState<Hutang[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // ================= LOAD TOKO =================
  useEffect(() => {
    const nama = localStorage.getItem('nama_toko')
    const logo = localStorage.getItem('logo_toko')

    if (nama) setNamaToko(nama)
    if (logo) setLogoToko(logo)
  }, [])

  // ================= LOAD DATA =================
  const loadData = async () => {
    try {
      const res = await fetch('/api/hutang')
      const data = await res.json()
      setDataHutang(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredData = dataHutang.filter((item) =>
    (item.namaPelanggan ?? '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID').format(angka)

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ================= CONTENT ================= */}
      <div className="flex-1 h-screen overflow-hidden relative">

        <div className="relative z-10 h-full flex flex-col p-2">

          {/* HEADER */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.4em] mb-6 shadow">
            Data Hutang Pelanggan
          </div>

          {/* SEARCH */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pelanggan..."
            className="w-full p-3 rounded-xl border bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-[1em]"
          />

          {/* TABLE WRAPPER */}
          <div className="flex-1 overflow-hidden">

            <div className="h-full overflow-y-auto rounded-xl">

              <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-xl shadow-md">

                {/* TABLE */}
                <table className="w-full">

                  {/* HEADER TABLE */}
                  <thead className="bg-gray-900 text-white sticky top-0 z-10 text-[1em]">
                    <tr>
                      <th className="p-3 border border-gray-700 font-bold">
                        No
                      </th>

                      <th className="p-3 border border-gray-700 font-bold text-left">
                        Nama
                      </th>

                      <th className="p-3 border border-gray-700 font-bold text-left">
                        Tanggal
                      </th>

                      <th className="p-3 border border-gray-700 font-bold text-right">
                        Total
                      </th>

                      <th className="p-3 border border-gray-700 font-bold text-center">
                        Status
                      </th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody className="text-[1em]">

                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center p-10">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center p-10 text-gray-400">
                          Tidak ada data hutang
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item, index) => (
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
                            {item.namaPelanggan}
                          </td>

                          {/* TANGGAL */}
                          <td className="p-3 border border-gray-300">
                            {new Date(item.createdAt).toLocaleDateString('id-ID')}
                          </td>

                          {/* TOTAL */}
                          <td className="p-3 border border-gray-300 text-right">
                            Rp {formatRupiah(item.total)}
                          </td>

                          {/* STATUS */}
                          <td className="p-3 border border-gray-300 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-white font-semibold text-[0.9em] ${
                                item.status === 'LUNAS'
                                  ? 'bg-green-600'
                                  : 'bg-red-500'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>

                        </tr>
                      ))
                    )}

                  </tbody>

                </table>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}