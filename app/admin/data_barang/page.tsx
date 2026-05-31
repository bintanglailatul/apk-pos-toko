
'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSettings } from "@/lib/useSettings"

type Barang = {
  id: number
  name: string
  harga: number
  harga_beli: number
  stok: number

  stokHijau?: number
  stokOrange?: number
  stokMerah?: number

  kategori?: string
}

export default function DataBarang() {
  const router = useRouter()
  const settings = useSettings()

  const [namaToko, setNamaToko] = useState('Baru Muncul')
  const [logoToko, setLogoToko] = useState('')

  const [barangList, setBarangList] = useState<Barang[]>([])

  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  const [name, setName] = useState('')
  const [harga, setHarga] = useState('')
  const [hargaBeli, setHargaBeli] = useState('')
  const [stok, setStok] = useState('')
  const [kategori, setKategori] = useState('')
  const [kategoriCustom, setKategoriCustom] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // ================= STOK =================
  const [stokHijau, setStokHijau] = useState(20)
  const [stokOrange, setStokOrange] = useState(10)
  const [stokMerah, setStokMerah] = useState(5)
  const [search, setSearch] = useState('')

  // ================= FORMAT =================
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka || 0)
  }

  const formatRupiahInput = (value: string) => {
    const numberString = value.replace(/[^,\d]/g, '').toString()
    const split = numberString.split(',')
    const sisa = split[0].length % 3

    let rupiah = split[0].substr(0, sisa)

    const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

    if (ribuan) {
      const separator = sisa ? '.' : ''
      rupiah += separator + ribuan.join('.')
    }

    return split[1] !== undefined
      ? rupiah + ',' + split[1]
      : rupiah
  }

  // ================= LOAD TOKO =================
  useEffect(() => {
    const nama = localStorage.getItem('nama_toko')
    const logo = localStorage.getItem('logo_toko')

    if (nama) setNamaToko(nama)
    if (logo) setLogoToko(logo)
  }, [])

  // ================= FETCH =================
  const fetchBarang = async () => {
    const res = await fetch('/api/products')
    const data = await res.json()

    setBarangList(data)
  }

  useEffect(() => {
    fetchBarang()
  }, [])

  const filteredBarang = barangList
  .filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => b.id - a.id)

const totalPages = Math.ceil(
  filteredBarang.length / itemsPerPage
)

const paginatedBarang = filteredBarang.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
)

  // ================= EDIT =================
  const handleEdit = (item: Barang) => {
    setShowModal(true)

    setEditId(item.id)

    setName(item.name)
    setHarga(String(item.harga))
    setHargaBeli(String(item.harga_beli || 0))
    setStok(String(item.stok))

    setStokHijau(item.stokHijau || 20)
    setStokOrange(item.stokOrange || 10)
    setStokMerah(item.stokMerah || 5)

    setKategori(item.kategori || '')

    setKategoriCustom('')
  }

  // ================= SAVE =================
  const [notif, setNotif] = useState("")

const handleSave = async () => {

  if (!name.trim()) {
    setNotif("❌ Nama barang wajib diisi")
    return
  }

  try {
    const method = editId ? 'PUT' : 'POST'

    const url = editId
      ? `/api/products/${editId}`
      : '/api/products'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        name,
        harga: Number(harga.replace(/\./g, '')),
        harga_beli: Number(hargaBeli.replace(/\./g, '')),
        stok: Number(stok),

        // WARNA STOK
        stokHijau: Number(stokHijau),
        stokOrange: Number(stokOrange),
        stokMerah: Number(stokMerah),

        kategori: kategori === "Lain-lain" ? kategoriCustom : kategori,
      }),
    })

    if (!res.ok) {
      throw new Error("Gagal simpan")
    }

    setNotif("✅ Barang berhasil disimpan")

    setTimeout(() => {
      setNotif("")
    }, 3000)

    setShowModal(false)
    setCurrentPage(1)

    fetchBarang()

  } catch (err) {
    setNotif("❌ Gagal menyimpan data")

    setTimeout(() => {
      setNotif("")
    }, 3000)
  }
}

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (confirm('Yakin hapus barang?')) {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      fetchBarang()
      if (currentPage > 1 && paginatedBarang.length === 1) {
  setCurrentPage(currentPage - 1)
}
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">

{/* ================= CONTENT ================= */}
<div className="flex-1 h-screen overflow-hidden relative">

<div className="relative z-10 h-full flex flex-col p-2">
    {/* HEADER */}
    <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.4em] mb-6 shadow">
      Data Barang
    </div>

    {/* NOTIF */}
    {notif && (
      <div className="mb-4 p-2 rounded-xl bg-green-500 text-white font-semibold">
        {notif}
      </div>
    )}

    {/* BUTTON + SEARCH */}
    <div className="mb-2">
      <button
        onClick={() => {
          setCurrentPage(1)
          setShowModal(true)
          setEditId(null)
          setName('')
          setHarga('')
          setHargaBeli('')
          setStok('')
          setStokHijau(20)
          setStokOrange(10)
          setStokMerah(5)
          setKategori('')
        }}
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-xl mb-3"
      >
        + Tambah Barang
      </button>

      {/* SEARCH */}
<input
  type="text"
  placeholder="Cari barang..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }}
  className="w-full p-3 rounded-xl border bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 mb-4"
/>
    </div>

{/* ================= TABLE WRAPPER ================= */}
<div className="flex-1 overflow-x-auto overflow-y-hidden">

  {/* SCROLL AREA */}
  <div className="h-full overflow-y-auto rounded-xl">
    {/* TABLE CARD */}
    <div className="min-w-[1200px] bg-white border border-gray-300 rounded-xl shadow-md">
      <table className="w-full table-fixed">

        {/* HEADER (DIPERTEGAS) */}
        <thead className="bg-gray-900 text-white sticky top-0 z-10 whitespace-nowrap">
          <tr>
            <th className="w-[80px] p-3 border border-gray-700 font-bold">
              Kode
            </th>
            <th className="w-[250px] p-3 border border-gray-700 font-bold">
              Nama
            </th>
            <th className="w-[150px] p-3 border border-gray-700 font-bold">
              Kategori
            </th>
            <th className="w-[140px] p-3 border border-gray-700 font-bold">
              Harga
            </th>
            <th className="w-[140px] p-3 border border-gray-700 font-bold">
              Harga Beli
            </th>
            <th className="w-[90px] p-3 border border-gray-700 font-bold">
              Stok
            </th>
            <th className="w-[180px] p-3 border border-gray-700 font-bold">
              Aksi
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {paginatedBarang.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-100 transition"
              >

                {/* KODE (TETAP ANGKA BIASA) */}
                <td className="p-3 border border-gray-300 text-center ">
                  {item.id}
                </td>

                <td className="p-3 border border-gray-300 truncate max-w-[250px]">
  {item.name}
</td>

                <td className="p-3 border border-gray-300 text-center">
                  {item.kategori || "-"}
                </td>

                <td className="p-3 border border-gray-300">
                  {formatRupiah(item.harga)}
                </td>

                <td className="p-3 border border-gray-300">
                  {formatRupiah(item.harga_beli)}
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

                {/* AKSI */}
                <td className="p-3 border border-gray-300">
                  <div className="flex gap-2 justify-center">

                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-lg font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold"
                    >
                      Hapus
                    </button>

                  </div>
                </td>

              </tr>
            ))}
        </tbody>

      </table>
      <div className="flex justify-center items-center gap-2 p-4">

  <button
    disabled={
  totalPages === 0 ||
  currentPage === 1
}
    onClick={() => setCurrentPage((prev) => prev - 1)}
    className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
  >
    &lt;
  </button>

  {Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-2 rounded-lg ${
        currentPage === page
          ? "bg-blue-700 text-white"
          : "bg-gray-200"
      }`}
    >
      {page}
    </button>
  ))}

  <button
    disabled={
  totalPages === 0 ||
  currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => prev + 1)}
    className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
  >
    &gt;
  </button>

</div>

    </div>
  </div>
</div>
</div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl w-[420px] shadow-xl">

            <h2 className="text-xl font-bold mb-5">
              {editId ? 'Edit Barang' : 'Tambah Barang'}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSave()
              }}
              className="space-y-4"
            >

              {/* NAMA */}
              <div>
                <label className="font-semibold text-[1em]">
                  Nama Barang
                </label>

                <input
  required
  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Pulpen"
                  className="border p-3 rounded-lg w-full mt-1"
                />
              </div>

            {/* KATEGORI */}
<div>
 <label className="font-semibold text-[1em]">
    Kategori
  </label>

  <select
    value={kategori}
    onChange={(e) => setKategori(e.target.value)}
    className="border p-3 rounded-lg w-full mt-1"
  >
    <option value="">-- Pilih Kategori --</option>

    <option value="ATK">ATK</option>

    <option value="Fotocopy">Fotocopy</option>

    <option value="print">Print</option>

    <option value="Lain-lain">Lain-lain</option>
  </select>
  {/* INPUT CUSTOM KATEGORI */}
{kategori === "Lain-lain" && (
  <div>
   <label className="font-semibold text-[1em]">
      Isi Kategori
    </label>

    <input
      value={kategoriCustom}
      onChange={(e) => setKategoriCustom(e.target.value)}
      placeholder="Contoh: Snack / Minuman / dll"
      className="border p-3 rounded-lg w-full mt-1"
    />
  </div>
)}
</div>

              {/* HARGA */}
              <div>
               <label className="font-semibold text-[1em]">
                  Harga Jual
                </label>

                <input
                  value={harga}
                  onChange={(e) =>
                    setHarga(formatRupiahInput(e.target.value))
                  }
                  placeholder="Rp 10.000"
                  className="border p-3 rounded-lg w-full mt-1"
                />
              </div>

              {/* HARGA BELI */}
              <div>
                <label className="font-semibold text-[1em]">
                  Harga Beli
                </label>

                <input
                  value={hargaBeli}
                  onChange={(e) =>
                    setHargaBeli(formatRupiahInput(e.target.value))
                  }
                  placeholder="Rp 5.000"
                  className="border p-3 rounded-lg w-full mt-1"
                />
              </div>

              {/* STOK */}
              <div>
               <label className="font-semibold text-[1em]">
                  Stok
                </label>

                <input
                  value={stok}
                  onChange={(e) => setStok(e.target.value)}
                  placeholder="Contoh: 10"
                  className="border p-3 rounded-lg w-full mt-1"
                />
              </div>

              {/* WARNA STOK */}
              <div className="grid grid-cols-3 gap-2">

                <div>
                  <label className="font-semibold text-[1em]">
                    Aman
                  </label>

                  <input
                    type="number"
                    value={stokHijau}
                    onChange={(e) =>
                      setStokHijau(Number(e.target.value))
                    }
                    className="border p-3 rounded-lg w-full mt-1"
                  />
                </div>

                <div>
                 <label className="font-semibold text-[1em]">
                    Menipis
                  </label>

                  <input
                    type="number"
                    value={stokOrange}
                    onChange={(e) =>
                      setStokOrange(Number(e.target.value))
                    }
                    className="border p-3 rounded-lg w-full mt-1"
                  />
                </div>

                <div>
                <label className="font-semibold text-[1em]">
                    Hampir Habis
                  </label>

                  <input
                    type="number"
                    value={stokMerah}
                    onChange={(e) =>
                      setStokMerah(Number(e.target.value))
                    }
                    className="border p-3 rounded-lg w-full mt-1"
                  />
                </div>

              </div>

             

              {/* BUTTON */}
              <div className="flex justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-blue-700 text-white px-4 py-3 rounded-xl text-[1em]"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
                >
                  Simpan
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
    </div>
  )
}