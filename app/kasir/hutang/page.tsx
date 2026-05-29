'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Hutang = {
  id: number
  namaPelanggan: string
  total: number
  bayar: number
  kembali: number
  status: string
  createdAt: string
  metode: string
  cart: any[]
}

export default function HutangPage() {
  const router = useRouter()

  const [dataHutang, setDataHutang] = useState<Hutang[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')

  const [metodeLunas, setMetodeLunas] =
    useState<'CASH' | 'QRIS' | 'TRANSFER'>('CASH')

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID').format(angka)

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

  // ================= GROUP HUTANG =================
  const groupedData = Object.values(
    dataHutang.reduce((acc: any, item) => {
      const nama = (item.namaPelanggan || '').trim()

      // kalau masih hutang → gabung
      // kalau lunas → tetap sendiri
      const key =
        item.status === 'HUTANG'
          ? nama
          : `${nama}-${item.id}`

      if (!acc[key]) {
        acc[key] = {
          ...item,
          total: item.total,
          semuaHutang: [item],
          jumlahStruk: 1
        }
      } else {
        acc[key].total += item.total
        acc[key].semuaHutang.push(item)
        acc[key].jumlahStruk += 1
      }

      return acc
    }, {})
  )

  // ================= SEARCH =================
  const filteredData = groupedData.filter((item: any) =>
    (item.namaPelanggan ?? '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // ================= LUNASI =================
  const lunasiHutang = async (item: any) => {
    const confirmBayar = confirm(
      `Lunasi semua hutang ${item.namaPelanggan}?`
    )

    if (!confirmBayar) return

    try {
      // lunasi semua hutang dengan nama sama
      for (const hutang of item.semuaHutang) {
        await fetch(`/api/hutang/${hutang.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            metode: metodeLunas
          })
        })
      }

      alert('Semua hutang berhasil dilunasi!')

      await loadData()

      // kirim semua struk
      const semuaStruk = item.semuaHutang.map(
        (hutang: any) => ({
          cart: hutang.cart,
          total: hutang.total,
          bayar: hutang.total,
          kembali: 0,
          metode: metodeLunas,
          status: 'LUNAS',
          namaPelanggan: hutang.namaPelanggan,
          createdAt: hutang.createdAt
        })
      )

      router.push(
        `/struk?data=${encodeURIComponent(
          JSON.stringify(semuaStruk)
        )}`
      )
    } catch {
      alert('Terjadi kesalahan!')
    }
  }

  // ================= CETAK =================
  const cetakStruk = (item: any) => {
    const semuaStruk = item.semuaHutang.map(
      (hutang: any) => ({
        cart: hutang.cart,
        total: hutang.total,
        bayar: hutang.total,
        kembali: 0,
        metode: hutang.metode,
        status: hutang.status,
        namaPelanggan: hutang.namaPelanggan,
        createdAt: hutang.createdAt
      })
    )

    router.push(
      `/struk?data=${encodeURIComponent(
        JSON.stringify(semuaStruk)
      )}`
    )
  }

  // ================= HAPUS =================
  const hapusHutang = async (item: any) => {
    const confirmHapus = confirm(
      `Hapus data hutang ${item.namaPelanggan}?`
    )

    if (!confirmHapus) return

    try {
      // hapus semua hutang dalam grup
      for (const hutang of item.semuaHutang) {
        await fetch(`/api/hutang/${hutang.id}`, {
          method: 'DELETE'
        })
      }

      alert('Berhasil dihapus!')
      loadData()
    } catch {
      alert('Terjadi kesalahan!')
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ================= CONTENT ================= */}
      <div className="flex-1 h-screen overflow-hidden relative">
        <div className="relative z-10 h-full flex flex-col p-2">
          {/* HEADER */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.5em] mb-6 shadow">
            Data Hutang Pelanggan
          </div>

          {/* SEARCH */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari nama pelanggan..."
              className="w-full p-3 rounded-xl border bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ================= TABLE WRAPPER ================= */}
          <div className="flex-1 overflow-hidden">
            {/* SCROLL AREA */}
            <div className="h-full overflow-y-auto rounded-xl">
              {/* TABLE CARD */}
              <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full">
                  {/* HEADER */}
                  <thead className="bg-gray-900 text-white sticky top-0 z-10">
                    <tr>
                      <th className="p-3 border border-gray-700 font-bold text-center w-14">
                        No
                      </th>

                      <th className="p-3 border border-gray-700 font-bold text-left">
                        Nama Pelanggan
                      </th>

                      <th className="p-3 border border-gray-700 font-bold text-center">
                        Tanggal
                      </th>

                      <th className="p-3 border border-gray-700 font-bold text-right">
                        Total
                      </th>

                      <th className="p-3 border border-gray-700 font-bold text-center">
                        Status
                      </th>

                      <th className="p-3 border border-gray-700 font-bold text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center p-10 text-gray-500"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center p-10 text-gray-400"
                        >
                          Tidak ada data hutang
                        </td>
                      </tr>
                    ) : (
                      filteredData.map(
                        (item: any, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-100 transition"
                          >
                            {/* NO */}
                            <td className="p-3 border border-gray-300 text-center">
                              {index + 1}
                            </td>

                            {/* NAMA */}
                            <td className="p-3 border border-gray-300 font-medium">
                              <div className="flex flex-col">
                                <span>
                                  {item.namaPelanggan}
                                </span>

                                {item.status ===
                                  'HUTANG' &&
                                  item.jumlahStruk >
                                    1 && (
                                    <span className="text-xs text-red-500">
                                      {
                                        item.jumlahStruk
                                      }{' '}
                                      struk hutang
                                    </span>
                                  )}
                              </div>
                            </td>

                            {/* TANGGAL */}
                            <td className="p-3 border border-gray-300 text-center">
                              {new Date(
                                item.createdAt
                              ).toLocaleDateString(
                                'id-ID'
                              )}
                            </td>

                            {/* TOTAL */}
                            <td className="p-3 border border-gray-300 text-right font-semibold text-blue-700">
                              Rp{' '}
                              {formatRupiah(
                                item.total
                              )}
                            </td>

                            {/* STATUS */}
                            <td className="p-3 border border-gray-300 text-center">
                              <span
                                className={`px-3 py-1 rounded-lg text-white font-semibold ${
                                  item.status ===
                                  'LUNAS'
                                    ? 'bg-green-600'
                                    : 'bg-red-500'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>

                            {/* AKSI */}
                            <td className="p-3 border border-gray-300">
                              {item.status ===
                              'HUTANG' ? (
                                <div className="flex flex-col items-center gap-2">
                                  <select
                                    value={
                                      metodeLunas
                                    }
                                    onChange={(e) =>
                                      setMetodeLunas(
                                        e.target
                                          .value as any
                                      )
                                    }
                                    className="border p-2 rounded-lg text-sm outline-none"
                                  >
                                    <option value="CASH">
                                      CASH
                                    </option>

                                    <option value="QRIS">
                                      QRIS
                                    </option>

                                    <option value="TRANSFER">
                                      TRANSFER
                                    </option>
                                  </select>

                                  <button
                                    onClick={() =>
                                      lunasiHutang(
                                        item
                                      )
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                                  >
                                    Lunasi
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() =>
                                      cetakStruk(
                                        item
                                      )
                                    }
                                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold"
                                  >
                                    Cetak
                                  </button>

                                  <button
                                    onClick={() =>
                                      hapusHutang(
                                        item
                                      )
                                    }
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      )
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