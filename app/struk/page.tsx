'use client'

declare const qz: any

import {
  useSearchParams,
  useRouter
} from 'next/navigation'

import {
  useEffect,
  useState,
  Suspense
} from 'react'

function StrukContent() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const [dataArray, setDataArray] = useState<any[]>([])
  const [ready, setReady] = useState(false)
  const [printed, setPrinted] = useState(false)

  // ================= SETTINGS =================
  const [namaToko, setNamaToko] = useState('BARU MUNCUL')
  const [alamat, setAlamat] = useState('Ds. Jeruk Ds. Mandesan Kec. Selopuro Kab. Blitar')
  const [telepon, setTelepon] = useState('085xxxxxxxx')
  const [footer, setFooter] = useState('Terima Kasih')
  const [logo, setLogo] = useState('')
  const [tagline, setTagline] = useState("")

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID').format(angka || 0)
  }

  // ================= POTONG NAMA BARANG =================
  const potongNama = (nama: string) => {
    if (!nama) return '-'

    if (nama.length > 22) {
      return nama.substring(0, 22) + '...'
    }

    return nama
  }

  // ================= LOAD SETTINGS =================
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return

        setNamaToko(data.namaToko || "")
        setAlamat(data.alamat || "")
        setTelepon(data.telepon || "")
        setFooter(data.footerStruk || "")
        setLogo(data.logoToko || "")
        setTagline(data.tagline || "")
      })
  }, [])

  // ================= PARSE DATA =================
  useEffect(() => {
    const raw = searchParams.get('data')

    if (!raw) {
      setDataArray([])
      setReady(false)
      return
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(raw))
      const arr = Array.isArray(parsed) ? parsed : [parsed]

      setDataArray(arr)

      setTimeout(() => {
        setReady(true)
      }, 100)

    } catch (e) {
      console.error("parse error", e)
      setDataArray([])
      setReady(false)
    }
  }, [searchParams])

  // ================= AUTO PRINT =================
  useEffect(() => {
    if (!ready) return
    if (printed) return
    if (dataArray.length === 0) return

    const timer = setTimeout(() => {
      window.print()
      setPrinted(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [ready, dataArray, printed])

  // ================= DATA KOSONG =================
  if (!ready || dataArray.length === 0) {
    return (
      <div className="text-center mt-10">

        <p>Data tidak ada</p>

        <button
          onClick={() =>
            router.push('/transaksi_kasir')
          }
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>

      </div>
    )
  }



  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-300 py-3">

        {/* STRUK */}
        <div className="print-thermal w-[52mm] bg-white pl-[3mm] pr-[1.5mm] py-[5px] text-black font-sans mx-auto">

          {dataArray.map((data: any, indexStruk: number) => {

            const tanggal = data.createdAt
              ? new Date(data.createdAt).toLocaleString('id-ID')
              : new Date().toLocaleString('id-ID')

            const noTransaksi =
              'TRX-' + Date.now() + '-' + indexStruk

            return (

              <div
                key={indexStruk}
                className={`${indexStruk !== dataArray.length - 1
                  ? 'mb-4 pb-4 border-b border-dashed border-black'
                  : ''
                }`}
              >

                {/* HEADER */}
                <div className="mb-1">

                  <div className="flex items-center gap-2">

                    {/* LOGO */}
                    <div className="w-9 flex justify-center">

                      {logo ? (
                        <img
                          src={logo}
                          alt="Logo"
                          className="w-8 h-8 object-cover rounded-full border border-black"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[6px]">
                          Logo
                        </div>
                      )}

                    </div>

                    {/* HEADER TEXT */}
                    <div className="flex-1 text-center leading-tight">

                      <p className="font-bold text-[10px] uppercase leading-tight">
                        {namaToko}
                      </p>

                      <p className="font-semibold text-[8px] uppercase">
                        {tagline}
                      </p>

                      <p className="text-[7px] leading-tight">
                        {alamat}
                      </p>

                      <p className="text-[7px]">
                        {telepon}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="border-t border-dashed border-black my-1"></div>

                {/* INFO */}
                <div className="text-[7px] space-y-[2px] leading-tight pl-[1mm]">

                  <div className="flex items-center gap-1">
                    <span className="w-[10mm]">No</span>
                    <span>:</span>
                    <span className="flex-1 truncate">
                      {noTransaksi}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="w-[10mm]">Tgl</span>
                    <span>:</span>
                    <span className="flex-1 truncate">
                      {tanggal}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="w-[10mm]">Metode</span>
                    <span>:</span>
                    <span className="flex-1 truncate">
                      {data.metode}
                    </span>
                  </div>

                </div>

                <div className="border-t border-dashed border-black my-1"></div>

                {/* ITEM */}
                <div className="space-y-1 pl-[1mm]">

                  {data.cart?.map((item: any, i: number) => (

                    <div key={i}>

                      <p className="font-semibold text-[8px] leading-tight break-all">
                        {potongNama(item.nama)}
                      </p>

                      {/* ITEM DETAIL */}
                      <div className="flex justify-between text-[7px] leading-tight gap-2">

                        <span className="truncate pr-2">
                          {item.qty} × {formatRupiah(item.harga)}
                        </span>

                        <span className="whitespace-nowrap text-[7px] pr-[1mm]">
                          {formatRupiah(item.qty * item.harga)}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

                <div className="border-t border-dashed border-black my-1"></div>

                {/* TOTAL */}
                <div className="space-y-[2px] text-[8px] leading-tight pl-[1mm]">

                  <div className="flex justify-between font-bold">

                    <span>Total</span>

                    <span className="whitespace-nowrap text-[7px] pr-[1mm]">
                      {formatRupiah(data.total)}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span>Bayar</span>

                    <span className="whitespace-nowrap text-[7px] pr-[1mm]">
                      {formatRupiah(data.bayar)}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span>Kembali</span>

                    <span className="whitespace-nowrap text-[7px] pr-[1mm]">
                      {formatRupiah(data.kembali)}
                    </span>

                  </div>

                </div>

                <div className="border-t border-dashed border-black my-2"></div>

                {/* FOOTER */}
                <div className="text-center leading-tight">

                  <p className="font-semibold text-[8px]">
                    {footer}
                  </p>

                  <p className="text-[7px]">
                    Terima Kasih
                  </p>

                </div>

              </div>

            )
          })}

          <button
            onClick={() =>
              router.push('/kasir/transaksi')
            }
            className="w-full mt-3 bg-blue-700 text-white p-2 rounded text-xs"
          >
            Transaksi Baru
          </button>

        </div>

      </div>

      <style jsx global>{`
        @media print {

          html,
          body {
            width: 54mm;
            margin: 0 auto;
            padding: 0;
            background: white;
            overflow: hidden;
          }

          button {
            display: none;
          }

          .print-area {
            width: 52mm;
            padding-left: 0.5mm;
            padding-right: 7mm;
            padding-top: 1px;
            padding-bottom: 1px;
            margin: 0 auto;
            box-sizing: border-box;
            overflow: hidden;
          }

          @page {
            size: 54mm auto;
            margin: 0;
          }
        }
      `}</style>
    </>
  )
}
export default function StrukPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StrukContent />
    </Suspense>
  )
}