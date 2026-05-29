'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Barang = {
  id: number
  nama: string
  harga: number
  stok: number
}

type CartItem = Barang & {
  qty: number
  isJasa?: boolean
}

export default function Transaksi() {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  const [metodeBayar, setMetodeBayar] =
    useState<'CASH' | 'QRIS' | 'TRANSFER' | 'HUTANG'>('CASH')

  const [uangBayar, setUangBayar] =
    useState<string>('')

  const uangBayarNumber = Number(
    uangBayar.replace(/\./g, '') || 0
  )

  const [jasaNama, setJasaNama] =
    useState('')
  const [jasaHarga, setJasaHarga] =
    useState('')

  const [namaHutang, setNamaHutang] =
  useState('')

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID').format(
      angka
    )

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(
          (item: any) => ({
            id: item.id,
            nama: item.name,
            harga: item.harga,
            stok: item.stok
          })
        )

        setBarangList(formatted)
      })
  }, [])

  const filteredBarang =
    search.trim() === ''
      ? barangList
      : barangList.filter(item =>
          item.nama
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )

  const addToCart = (barang: Barang) => {
    const exist = cart.find(
      item => item.id === barang.id
    )

    if (exist) {
      setCart(
        cart.map(item =>
          item.id === barang.id
            ? {
                ...item,
                qty: item.qty + 1
              }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          ...barang,
          qty: 1
        }
      ])
    }
  }

  const decreaseQty = (id: number) => {
    const exist = cart.find(
      item => item.id === id
    )

    if (!exist) return

    if (exist.qty <= 1) {
      setCart(
        cart.filter(
          item => item.id !== id
        )
      )
      return
    }

    setCart(
      cart.map(item =>
        item.id === id
          ? {
              ...item,
              qty: item.qty - 1
            }
          : item
      )
    )
  }

  const tambahJasa = () => {
    if (!jasaNama || !jasaHarga) {
      alert('Isi jasa dulu!')
      return
    }

    setCart([
      ...cart,
      {
        id: Date.now(),
        nama: jasaNama,
        harga: Number(jasaHarga),
        stok: 999,
        qty: 1,
        isJasa: true
      }
    ])

    setJasaNama('')
    setJasaHarga('')
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + item.harga * item.qty,
    0
  )

  const kembali =
    metodeBayar === 'CASH'
      ? uangBayarNumber - total
      : 0

  const handleBayar = async () => {
    if (loading) return

    if (cart.length === 0) {
      alert('Keranjang kosong!')
      return
    }

    if (
      metodeBayar === 'CASH' &&
      uangBayarNumber < total
    ) {
      alert('Uang tidak cukup!')
      return
    }

    if (
      metodeBayar === 'HUTANG' &&
      !namaHutang
    ) {
      alert('Nama pelanggan wajib diisi!')
      return
    }

    setLoading(true)

    // ✅ SATU DATA FINAL (FIX)
    const transaksiData = {
      cart,
      total,

      bayar:
        metodeBayar === 'CASH'
          ? uangBayarNumber
          : metodeBayar === 'HUTANG'
          ? 0
          : total,

      kembali:
        metodeBayar === 'CASH'
          ? kembali
          : 0,

      metode: metodeBayar,

      status:
        metodeBayar === 'HUTANG'
          ? 'HUTANG'
          : 'LUNAS',

      namaPelanggan:
        metodeBayar === 'HUTANG'
          ? namaHutang
          : null,

      userId: 2,

      createdAt: new Date() // 🔥 penting untuk struk
    }

    try {
      const res = await fetch(
        '/api/transaksi',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify(transaksiData)
        }
      )

      const result = await res.json()

      if (!result.success) {
        alert(
          result.message ||
            'Gagal simpan transaksi!'
        )
        setLoading(false)
        return
      }

      setLoading(false)

      // ✅ REDIRECT AMAN
      const encoded = encodeURIComponent(
        JSON.stringify(transaksiData)
      )

      if (transaksiData.metode === 'HUTANG') {
        alert('Transaksi hutang berhasil disimpan!')
      }

      router.push(`/struk?data=${encodeURIComponent(JSON.stringify(transaksiData))}`)

      setTimeout(() => {
  setCart([])
  setUangBayar('')
  setNamaHutang('')
  setMetodeBayar('CASH')
}, 200)

    } catch {
      alert('Terjadi kesalahan!')
      setLoading(false)
    }
  }

  // ================= TOTAL SUMMARY =================
  const totalItem = cart.reduce((sum, item) => sum + item.qty, 0)
  const totalBarang = cart.length

  return (
  <div className="h-full overflow-y-auto bg-transparent p-3 text-[14px]">

    {/* HEADER */}
    <div className="text-center mb-5">

      <div className="bg-slate-900 p-6 text-white rounded-2xl font-bold text-xl shadow">
        Transaksi Penjualan
      </div>

    </div>

  {/* CONTENT WRAPPER */}
<div className="px-4 md:px-10 py-2 space-y-5">

  {/* SEARCH */}
  <input
    type="text"
    placeholder="Cari barang..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full p-3 rounded-2xl border bg-white/90 backdrop-blur-md text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 shadow"
  />

  {/* BARANG + JASA */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

    {/* BARANG */}
    <div className="lg:col-span-2 bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-5">

      <h2 className="text-[18px] font-bold mb-4 text-slate-800">
        Daftar Barang
      </h2>

      <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">

        {filteredBarang.map(item => (
          <div
            key={item.id}
            onClick={() => addToCart(item)}
            className="py-3 px-3 flex justify-between items-center hover:bg-blue-50 rounded-xl cursor-pointer border-b transition"
          >

            <div className="flex items-center gap-3">

              <div
                className={`w-3 h-3 rounded-full ${
                  item.stok < 5
                    ? 'bg-red-500'
                    : item.stok < 10
                    ? 'bg-yellow-400'
                    : 'bg-green-500'
                }`}
              />

              <p className="font-medium text-slate-700">
                {item.nama}
              </p>

            </div>

            <p className="text-blue-700 font-semibold">
              Rp {formatRupiah(item.harga)}
            </p>

          </div>
        ))}

      </div>

    </div>

    {/* JASA */}
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-5 h-fit">

      <h2 className="text-[18px] font-bold mb-4 text-slate-800">
        Tambah Jasa
      </h2>

      <div className="space-y-4">

        <input
          value={jasaNama}
          onChange={(e) =>
            setJasaNama(e.target.value)
          }
          placeholder="Nama jasa"
          className="w-full border p-3 rounded-2xl outline-none"
        />

        <input
          value={jasaHarga}
          onChange={(e) =>
            setJasaHarga(e.target.value)
          }
          placeholder="Harga jasa"
          className="w-full border p-3 rounded-2xl outline-none"
        />

        <button
          onClick={tambahJasa}
          className="w-full bg-green-600 hover:bg-green-700 transition text-white p-3 rounded-2xl font-semibold"
        >
          Tambah Jasa
        </button>

      </div>

    </div>

  </div>

{/* ================= KERANJANG ================= */}
<div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-5">

  <div className="flex justify-between items-center mb-4">

    <h2 className="text-[18px] font-bold text-slate-800">
      Keranjang
    </h2>

    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
      {cart.length} Item
    </span>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full border-separate border-spacing-y-3">

      {/* HEADER */}
      <thead>
        <tr className="text-slate-700 text-sm">

          <th className="bg-slate-200/80 p-3 text-left rounded-l-2xl font-semibold">
            Barang
          </th>

          <th className="bg-slate-200/80 p-3 text-center font-semibold">
            Qty
          </th>

          <th className="bg-slate-200/80 p-3 text-right rounded-r-2xl font-semibold">
            Total
          </th>

        </tr>
      </thead>

      {/* BODY */}
      <tbody>

        {cart.length === 0 ? (

          <tr>
            <td
              colSpan={3}
              className="text-center py-10 text-gray-400"
            >
              Keranjang kosong
            </td>
          </tr>

        ) : (

          cart.map(item => (

            <tr
              key={item.id}
              className="bg-white shadow-sm hover:shadow-md transition rounded-2xl overflow-hidden"
            >

              {/* BARANG */}
              <td className="p-3 rounded-l-2xl">
                <div className="flex flex-col">

                  <p className="font-semibold text-slate-700">
                    {item.nama}
                  </p>

                  <p className="text-xs text-gray-400">
                    Rp {formatRupiah(item.harga)}
                  </p>

                </div>
              </td>

              {/* QTY */}
              <td className="p-3">
                <div className="flex items-center justify-center gap-2">

                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={item.qty}
                    className="w-14 border rounded-xl text-center py-1 outline-none"
                    onChange={(e) => {
                      const val = Number(e.target.value)

                      setCart(
                        cart.map(i =>
                          i.id === item.id
                            ? { ...i, qty: val }
                            : i
                        )
                      )
                    }}
                  />

                  <button
                    onClick={() => addToCart(item)}
                    className="w-9 h-9 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow"
                  >
                    +
                  </button>

                </div>
              </td>

              {/* TOTAL */}
              <td className="p-3 text-right rounded-r-2xl">
                <span className="font-bold text-blue-700">
                  Rp {formatRupiah(item.harga * item.qty)}
                </span>
              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

  {/* ================= SUMMARY ================= */}
  {cart.length > 0 && (
    <>
      <div className="mt-5 bg-white border rounded-2xl p-4 flex justify-between items-center">

        <div className="flex gap-3">

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {totalBarang} Jenis
          </span>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            {totalItem} Qty
          </span>

        </div>

      </div>

      {/* TOTAL */}
      <div className="mt-3 bg-slate-100 rounded-2xl p-4 flex justify-between items-center">

        <p className="font-semibold text-slate-700">
          Total Pembayaran
        </p>

        <h2 className="text-2xl font-bold text-blue-700">
          Rp {formatRupiah(total)}
        </h2>

      </div>
    </>
  )}

</div>

  {/* METODE PEMBAYARAN */}
  <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-5">

    <h2 className="text-[18px] font-bold mb-5 text-slate-800">
      Metode Pembayaran
    </h2>

  <div className="flex flex-wrap gap-3 mb-5">

    {[
      'CASH',
      'QRIS',
      'TRANSFER',
      'HUTANG'
    ].map(item => (

      <button
        key={item}
        onClick={() =>
          setMetodeBayar(item as any)
        }
        className={`px-5 py-3 rounded-2xl font-semibold transition-all ${
          metodeBayar === item
            ? 'bg-blue-700 text-white shadow-lg scale-105'
            : 'bg-white hover:bg-slate-100 border'
        }`}
      >
        {item}
      </button>

    ))}

  </div>

  {/* KETERANGAN */}
  <div className="bg-slate-100 rounded-2xl p-4 mb-5 text-gray-700">

    {metodeBayar === 'CASH' &&
      'Pembayaran dilakukan menggunakan uang tunai.'}

    {metodeBayar === 'QRIS' &&
      'Pembayaran digital menggunakan QRIS.'}

    {metodeBayar === 'TRANSFER' &&
      'Pembayaran melalui transfer bank.'}

    {metodeBayar === 'HUTANG' &&
      'Transaksi akan masuk ke daftar hutang pelanggan.'}

  </div>

  {/* HUTANG */}
  {metodeBayar === 'HUTANG' && (

    <div className="space-y-4 mb-4">

      <input
        type="text"
        value={namaHutang}
        onChange={(e) =>
          setNamaHutang(e.target.value)
        }
        placeholder="Masukkan nama pelanggan"
        className="w-full border p-3 rounded-2xl outline-none"
      />

      <div className="bg-red-100 border border-red-300 rounded-2xl p-4">

        <p className="text-red-700 text-sm">
          Struk hanya bisa dicetak setelah hutang lunas.
        </p>

      </div>

    </div>

  )}

  {/* CASH */}
  {metodeBayar === 'CASH' && (

    <div className="space-y-4">

      <input
        type="text"
        value={uangBayar}
        onChange={(e) => {
          const value =
            e.target.value.replace(/\D/g, '')

          setUangBayar(value)
        }}
        placeholder="Masukkan uang bayar"
        className="w-full border p-3 rounded-2xl outline-none"
      />

      <div className="bg-green-100 border border-green-300 rounded-2xl p-4 flex justify-between items-center">

        <p className="text-gray-700 font-medium">
          Kembalian
        </p>

        <h2 className="text-2xl font-bold text-green-700">
          Rp {formatRupiah(
            kembali < 0 ? 0 : kembali
          )}
        </h2>

      </div>

    </div>

  )}

  {/* BUTTON */}
  <button
    onClick={handleBayar}
    disabled={loading}
    className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-2xl font-bold shadow-lg transition"
  >
    {loading
      ? 'Loading...'
      : 'Bayar Sekarang'}
  </button>

</div>
</div>
          </div>

    
  )
}