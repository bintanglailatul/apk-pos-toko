'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useSettings } from "@/lib/useSettings"

export default function PengeluaranPage() {
  const router = useRouter()

  const [keterangan, setKeterangan] = useState("")
  const [kategori, setKategori] = useState("")
  const [kategoriCustom, setKategoriCustom] = useState("")
  const [metode, setMetode] = useState("")
  const [supplier, setSupplier] = useState("")
  const [bukti, setBukti] = useState<File | null>(null)

  const [jumlah, setJumlah] = useState("")
  const [tanggal, setTanggal] = useState("")
  const [userInput, setUserInput] = useState("")

  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState("")
  const [riwayat, setRiwayat] = useState<any[]>([])

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const fetchRiwayat = async () => {
  try {
    const res = await fetch("/api/pengeluaran")
    const data = await res.json()

    setRiwayat(data)
  } catch (error) {
    console.error(error)
  }
}
  useEffect(() => {
  const user = localStorage.getItem("user")

  if (!user) return

  try {
    const parsed = JSON.parse(user)

console.log(parsed)
    if (parsed?.id) {
      setUserInput(String(parsed.id))
    }

  } catch (err) {
    console.log("User bukan JSON")
  }
}, [])
useEffect(() => {
  fetchRiwayat()
}, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!keterangan || !kategori || !metode || !supplier || !jumlah || !tanggal) {
      alert("Semua field harus diisi!")
      return
    }

    try {
      setLoading(true)
      setNotif("")

      const formData = new FormData()

      formData.append("keterangan", keterangan)
      formData.append("kategori", kategori === "Lain-lain" ? kategoriCustom : kategori)
      formData.append("metode", metode)
      formData.append("supplier", supplier)
      formData.append("jumlah", jumlah)
      formData.append("tanggal", tanggal)
      formData.append("user_input", userInput)

      if (bukti) formData.append("bukti", bukti)
        

      const res = await fetch('/api/pengeluaran', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error("Gagal simpan")

      setKeterangan("")
      setKategori("")
      setMetode("")
      setSupplier("")
      setJumlah("")
      setTanggal("")
      setBukti(null)

      if (fileInputRef.current) fileInputRef.current.value = ""

      setNotif("✅ Berhasil disimpan")
      fetchRiwayat()

      setTimeout(() => setNotif(""), 3000)

    } catch (error) {
      console.error(error)
      alert("Gagal simpan data")
    } finally {
      setLoading(false)
    }
  }
  const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

const riwayat30Hari = riwayat
  .filter((item) => {
    const tanggalItem = new Date(item.tanggal)
    return tanggalItem >= thirtyDaysAgo
  })
  .sort((a, b) => b.id - a.id)

  return (
    <div className="flex h-screen overflow-hidden text-[1em]">

      {/* CONTENT */}
      <div className="flex-1 h-screen overflow-hidden relative">

        <div className="relative z-10 h-full flex flex-col p-2">

          {/* HEADER */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.4em] mb-6 shadow">
            Input Pengeluaran
          </div>

          {/* NOTIF */}
          {notif && (
            <div className="mb-4 p-3 rounded-xl bg-green-500 text-white font-semibold shadow text-[1em]">
              {notif}
            </div>
          )}

          {/* FORM WRAPPER */}
          <div className="flex-1 overflow-hidden">

            <div className="h-full overflow-y-auto rounded-xl pr-1 custom-scroll">

              <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-xl shadow-md p-6 mx-[2cm] mb-10">

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 text-[1em]"
                >

                  {/* KETERANGAN */}
                  <div>
                    <label className="font-semibold text-[1em]">
                      Keterangan
                    </label>

                    <input
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                      className="w-full mt-1 border p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 text-[1em]"
                      placeholder="Contoh: Beli tinta printer"
                    />
                  </div>

                  {/* KATEGORI */}
                  <div>
                    <label className="font-semibold text-[1em]">
                      Kategori Pengeluaran
                    </label>

                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full mt-1 border p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 text-[1em]"
                    >
                      <option value="">-- Pilih Kategori --</option>
                      <option value="Operasional">Operasional</option>
                      <option value="ATK">ATK</option>
                      <option value="Fotocopy">Fotocopy</option>
                      <option value="Gaji/Upah">Gaji / Upah</option>
                      <option value="Lain-lain">Lain-lain</option>
                    </select>
                  </div>

                  {/* CUSTOM */}
                  {kategori === "Lain-lain" && (
                    <div>
                      <label className="font-semibold text-[1em]">
                        Isi Kategori Lainnya
                      </label>

                      <input
                        value={kategoriCustom}
                        onChange={(e) => setKategoriCustom(e.target.value)}
                        className="w-full mt-1 border p-3 rounded-xl text-[1em]"
                      />
                    </div>
                  )}

                  {/* METODE */}
                  <div>
                    <label className="font-semibold text-[1em]">
                      Metode Pembayaran
                    </label>

                    <select
                      value={metode}
                      onChange={(e) => setMetode(e.target.value)}
                      className="w-full mt-1 border p-3 rounded-xl text-[1em]"
                    >
                      <option value="">-- Pilih Metode --</option>
                      <option value="Cash">Cash</option>
                      <option value="Transfer">Transfer</option>
                      <option value="QRIS">QRIS</option>
                      <option value="Debit">Debit</option>
                    </select>
                  </div>

                  {/* SUPPLIER */}
                  <div>
                    <label className="font-semibold text-[1em]">
                      Nama Supplier / Toko
                    </label>

                    <input
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="w-full mt-1 border p-3 rounded-xl text-[1em]"
                    />
                  </div>

                  {/* JUMLAH */}
                  <div>
                    <label className="font-semibold text-[1em]">
                      Jumlah (Rp)
                    </label>

                    <input
                      value={jumlah ? "Rp " + Number(jumlah).toLocaleString("id-ID") : ""}
                      onChange={(e) => setJumlah(e.target.value.replace(/\D/g, ""))}
                      className="w-full mt-1 border p-3 rounded-xl text-[1em]"
                    />
                  </div>

                  {/* TANGGAL */}
                  <div>
                    <label className="font-semibold text-[1em]">
                      Tanggal
                    </label>

                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full mt-1 border p-3 rounded-xl text-[1em]"
                    />
                  </div>

                  {/* FILE */}
                  <div>
                    <label className="font-semibold text-[1em] block mb-2">
                      📸 Bukti Transaksi
                    </label>

                    <label className="flex items-center gap-3 border p-3 rounded-xl bg-white cursor-pointer">
                      <span className="bg-blue-700 text-white px-4 py-2 rounded-lg">
                        📂 Pilih File
                      </span>

                      <span className="text-[0.95em] text-gray-700 truncate">
                        {bukti ? bukti.name : "Belum ada file"}
                      </span>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setBukti(e.target.files[0])
                        }}
                      />
                    </label>
                  </div>

                  {/* BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-4 rounded-xl text-white font-bold transition shadow-md text-[1.1em] ${
                      loading ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-800"
                    }`}
                  >
                    {loading ? "Memproses..." : "Simpan Pengeluaran"}
                  </button>

                </form>

                <div className="mt-8">
  <h2 className="font-bold text-xl mb-3">
    Riwayat (30 Hari)
  </h2>
  <div className="overflow-x-auto">
    <table className="w-full border">
      <thead className="bg-slate-900 text-white">
        <tr>
          <th className="p-2 border">Tanggal</th>
          <th className="p-2 border">Keterangan</th>
          <th className="p-2 border">Kategori</th>
          <th className="p-2 border">Metode</th>
          <th className="p-2 border">Supplier</th>
          <th className="p-2 border">Jumlah</th>
          <th className="p-2 border">Input Oleh</th>
          <th className="p-2 border">Bukti</th>
        </tr>
      </thead>

      <tbody>
        {riwayat30Hari.map((item) => (
          <tr key={item.id}>
            <td className="p-2 border">
              {new Date(item.tanggal).toLocaleDateString("id-ID")}
            </td>

            <td className="p-2 border text-center">
              {item.keterangan}
            </td>

            <td className="p-2 border text-center">
              {item.kategori}
            </td>

            <td className="p-2 border text-center">
              {item.metode}
            </td>

            <td className="p-2 border text-center">
              {item.supplier}
            </td>

            <td className="p-2 border text-center">
              Rp {Number(item.jumlah).toLocaleString("id-ID")}
            </td>
            <td className="p-3 border text-center">
            {item.users?.role || "-"}
                          </td>

                          <td className="p-3 border text-center print-hidden">
                          {item.bukti ? (
                          <a
                          href={item.bukti}
                          target="_blank"
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                          > Lihat 
                          </a>
               ) : "-"}
              </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}