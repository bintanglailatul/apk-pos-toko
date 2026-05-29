'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Barang = {
  id: number
  nama: string
  harga: number
}

type CartItem = Barang & {
  qty: number
}

export default function Transaksi() {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [barangList, setBarangList] = useState<Barang[]>([]) // kosong
  const [cart, setCart] = useState<CartItem[]>([])

  // Filter barang
  const filteredBarang = barangList.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  )

  // Tambah ke keranjang
  const addToCart = (barang: Barang) => {
    const exist = cart.find((item) => item.id === barang.id)

    if (exist) {
      setCart(
        cart.map((item) =>
          item.id === barang.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { ...barang, qty: 1 }])
    }
  }

  // Enter handler
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && filteredBarang.length > 0) {
      addToCart(filteredBarang[0])
      setSearch('')
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.harga * item.qty,
    0
  )
  const handleBayar = () => {
  if (cart.length === 0) {
    alert('Keranjang kosong!')
    return
  }

  const data = {
    cart,
    total,
    bayar: total,
    kembali: 0
  }

  router.push(`/struk?data=${encodeURIComponent(JSON.stringify(data))}`)
}

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">

        <div className="bg-blue-700 p-4 text-center font-bold text-lg">
          Baru Muncul
        </div>

        <div className="flex items-center gap-3 p-4 border-b border-gray-700">
          <div className="w-10 h-10 rounded-full bg-white"></div>
          <p className="text-sm font-semibold">Kasir</p>
        </div>

        <div className="flex-1 p-4 space-y-2 text-sm">
          <button
            onClick={() => router.push('/dashboard_kasir')}
            className="w-full text-left p-3 rounded hover:bg-blue-800"
          >
            🏠 Dashboard
          </button>

          <button className="w-full text-left p-3 rounded bg-blue-800">
            🛒 Transaksi
          </button>

          <button
            onClick={() => router.push('/pengeluaran_kasir')}
            className="w-full text-left p-3 rounded hover:bg-blue-800"
          >
            💸 Input Pengeluaran
          </button>

          <button
            onClick={() => router.push('/stok')}
            className="w-full text-left p-3 rounded hover:bg-blue-800"
          >
            📦 Cek Stok
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 bg-gray-100 p-6">

        <div className="bg-slate-900 text-white p-4 rounded shadow text-center font-bold text-xl mb-6">
          Transaksi Penjualan
        </div>

        {/* Cari Barang */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Cari Barang</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Ketik nama barang..."
            className="w-80 p-2 border rounded focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Daftar Barang */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Daftar Barang</h2>
          <div className="bg-white shadow rounded p-4 w-96">

            <div className="flex justify-between font-semibold border-b pb-2">
              <span>Barang</span>
              <span>Harga</span>
            </div>

            {filteredBarang.length === 0 && (
              <p className="text-gray-400 text-sm mt-3">
                Data barang belum tersedia
              </p>
            )}

            {filteredBarang.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="flex justify-between p-2 rounded cursor-pointer hover:bg-gray-200"
              >
                <span>{item.nama}</span>
                <span>Rp {item.harga}</span>
              </div>
            ))}

          </div>
        </div>

        {/* Keranjang */}
        <div className="bg-white shadow rounded p-4 max-w-2xl">
          <h2 className="font-semibold mb-3">KERANJANG</h2>

          <table className="w-full text-left border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Barang</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Harga</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-3 text-gray-400">
                    Keranjang kosong
                  </td>
                </tr>
              )}

              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border">{item.nama}</td>
                  <td className="p-2 border">{item.qty}</td>
                  <td className="p-2 border">
                    Rp {item.harga * item.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4 font-bold text-lg">
            Total : Rp {total}
          </div>

          <button
          onClick={handleBayar}
          className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white p-3 rounded font-semibold"> 
          Bayar
          </button>
        </div>

      </div>
    </div>
  )
}