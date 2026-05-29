"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingAdmin() {
  const router = useRouter();

  // ================= TOKO =================
  const [namaToko, setNamaToko] = useState("");
  const [logoToko, setLogoToko] = useState("");

  // ================= BACKGROUND =================
  const [adminBackgroundImage, setAdminBackgroundImage] = useState("");
  const [adminBackgroundColor, setAdminBackgroundColor] = useState("#0f172a");
  const [adminBackgroundOpacity, setAdminBackgroundOpacity] = useState(0.3);

  // ================= STRUK =================
  const [footerStruk, setFooterStruk] = useState("Terima Kasih");
  const [strukFontSize, setStrukFontSize] = useState("14");

  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [tagline, setTagline] = useState("");

  // ================= FONT GLOBAL =================
  const [adminFontSize, setAdminFontSize] = useState("sedang");

  // ================= STOK =================
  const [stokGreenLimit, setStokGreenLimit] = useState(20);
  const [stokOrangeLimit, setStokOrangeLimit] = useState(10);
  const [stokRedLimit, setStokRedLimit] = useState(5);

  // ================= WARNA STOK =================
  const [stokGreenColor, setStokGreenColor] = useState("#16a34a");
  const [stokOrangeColor, setStokOrangeColor] = useState("#f59e0b");
  const [stokRedColor, setStokRedColor] = useState("#dc2626");

  // ================= SYSTEM =================
  const [notif, setNotif] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOAD =================
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;

        setNamaToko(data.namaToko || "");
        setLogoToko(data.logoToko || "");

        setAdminBackgroundImage(data.adminBackgroundImage || "");
        setAdminBackgroundColor(data.adminBackgroundColor || "#0f172a");
        setAdminBackgroundOpacity(data.adminBackgroundOpacity ?? 0.3);

        setFooterStruk(data.footerStruk || "Terima Kasih");
        setStrukFontSize(data.strukFontSize || "14");

        setAlamat(data.alamat || "");
        setTelepon(data.telepon || "");
        setTagline(data.tagline || "");

        setAdminFontSize(data.adminFontSize || "sedang");

        setStokGreenLimit(data.stokGreenLimit || 20);
        setStokOrangeLimit(data.stokOrangeLimit || 10);
        setStokRedLimit(data.stokRedLimit || 5);

        setStokGreenColor(data.stokGreenColor || "#16a34a");
        setStokOrangeColor(data.stokOrangeColor || "#f59e0b");
        setStokRedColor(data.stokRedColor || "#dc2626");
      });
  }, []);

  // ================= FILE =================
  const handleFile = (
    file: File,
    cb: (val: string) => void
  ) => {
    const reader = new FileReader();

    reader.onload = () => {
      cb(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        namaToko,
        logoToko,

        adminBackgroundImage,
        adminBackgroundColor,
        adminBackgroundOpacity,

        footerStruk,
        strukFontSize,

        alamat,
        telepon,
        tagline,

        adminFontSize,

        stokGreenLimit,
        stokOrangeLimit,
        stokRedLimit,

        stokGreenColor,
        stokOrangeColor,
        stokRedColor,
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Gagal");
      }

      localStorage.setItem("nama_toko", namaToko);
      localStorage.setItem("logo_toko", logoToko);

      localStorage.setItem("background", adminBackgroundImage);
      localStorage.setItem("background_color", adminBackgroundColor);
      localStorage.setItem("background_opacity",String(adminBackgroundOpacity));

      localStorage.setItem("adminFontSize", adminFontSize);
      localStorage.setItem("footer_struk", footerStruk);
      localStorage.setItem("font_size_struk",strukFontSize);

      localStorage.setItem("alamat_toko", alamat);
      localStorage.setItem("telepon_toko", telepon);
      localStorage.setItem("tagline_toko", tagline);


      setNotif("✅ Setting berhasil disimpan");

    } catch (error) {

      setNotif("❌ Gagal menyimpan setting");

    } finally {

      setLoading(false);

      setTimeout(() => {
        setNotif("");
      }, 3000);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-2">

        {/* HEADER */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.4em] mb-6 shadow">
          Setting Sistem
        </div>

        {/* NOTIF */}
        {notif && (
          <div
            className={`mb-4 p-3 rounded-2xl text-white font-semibold ${
              notif.includes("Gagal")
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          >
            {notif}
          </div>
        )}

        {/* GRID */}
        <div className="w-full px-4 md:px-16 grid grid-cols-1 gap-6">
          {/* ================= TOKO ================= */}
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-6 flex-1 min-w-0">
            <h2 className="font-bold text-[1.1em] mb-5"> 
              🏪 Setting Toko
            </h2>

             {/* LOGO */}
            <label className="font-semibold text-[1em] block mb-2">
              Logo Toko
            </label>

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleFile(file, setLogoToko);
                }
              }}
              className="mb-4"
            />

            {logoToko && (
              <img
                src={logoToko}
                className="w-20 h-20 rounded-2xl object-cover mb-5 border"
              />
            )}

            <label className="font-semibold text-[1em] block mb-2">
              Nama Toko
            </label>

            <input
              value={namaToko}
              onChange={(e) =>
                setNamaToko(e.target.value)
              }
              placeholder="Nama toko"
              className="w-full border border-gray-300 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* FONT GLOBAL */}
<label className="font-semibold text-[1em] block mb-2">
  Ukuran Huruf Sistem
</label>

<select
  value={adminFontSize}
  onChange={(e) => setAdminFontSize(e.target.value)}
  className="w-full border border-gray-300 p-3 rounded-2xl"
>
  <option value="kecil">Kecil</option>
  <option value="sedang">Sedang</option>
  <option value="besar">Besar</option>
</select>

            

          </div>

        
          {/* ================= BACKGROUND ================= */}
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-6">

            <h2 className="font-bold text-[1.1em] mb-5">
              🎨 Background Sistem
            </h2>

            {/* WARNA */}
            <div className="mb-5">

              <label className="font-semibold text-[1em] block mb-2">
                Warna Background
              </label>

              <input
                type="color"
                value={adminBackgroundColor}
                onChange={(e) =>
                  setAdminBackgroundColor(e.target.value)
                }
                className="w-full h-14 rounded-xl cursor-pointer border"
              />

            </div>

            {/* GAMBAR */}
            <div className="mb-5">

              <label className="font-semibold text-[1em] block mb-2">
                Gambar Background
              </label>

              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleFile(
                      file,
                      setAdminBackgroundImage
                    );
                  }
                }}
                className="w-full"
              />

            </div>

            {/* OPACITY */}
            <div className="mb-5">

              <label className="font-semibold text-[1em] block mb-2">
                Kejelasan Background
              </label>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={adminBackgroundOpacity}
                onChange={(e) =>
                  setAdminBackgroundOpacity(
                    Number(e.target.value)
                  )
                }
                className="w-full accent-blue-600"
              />

              <p className="text-sm text-gray-500 mt-1">
                {Math.round(
                  adminBackgroundOpacity * 100
                )}%
              </p>

            </div>

            {/* PREVIEW */}
            <div
              className="relative h-44 rounded-2xl overflow-hidden border"
              style={{
                backgroundColor: adminBackgroundColor,
              }}
            >

              {adminBackgroundImage && (
                <img
                  src={adminBackgroundImage}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: adminBackgroundOpacity,
                  }}
                />
              )}

            </div>

          </div>

          {/* ================= STRUK ================= */}
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-6">

            <h2 className="font-bold text-[1.1em] mb-5">
              🧾 Setting Struk
            </h2>

           

            {/* TAGLINE */}
            <label className="font-semibold text-[1em] block mb-2">
              Tagline
            </label>

            <input
              value={tagline}
              onChange={(e) =>
                setTagline(e.target.value)
              }
              placeholder="TOKO ATK DAN JASA CETAK"
              className="w-full border border-gray-300 p-3 rounded-2xl mb-4"
            />

            {/* ALAMAT */}
            <label className="font-semibold text-[1em] block mb-2">
              Alamat
            </label>

            <textarea
              value={alamat}
              onChange={(e) =>
                setAlamat(e.target.value)
              }
              placeholder="Alamat toko"
              className="w-full border border-gray-300 p-3 rounded-2xl mb-4 min-h-[17.5]"
            />

            {/* TELEPON */}
            <label className="font-semibold text-[1em] block mb-2">
              Nomor Telepon
            </label>

            <input
              value={telepon}
              onChange={(e) =>
                setTelepon(e.target.value)
              }
              placeholder="08xxxxxxxxxx"
              className="w-full border border-gray-300 p-3 rounded-2xl mb-4"
            />

            {/* FOOTER */}
            <label className="font-semibold text-[1em] block mb-2">
              Footer Struk
            </label>

            <input
              value={footerStruk}
              onChange={(e) =>
                setFooterStruk(e.target.value)
              }
              placeholder="Terima Kasih"
              className="w-full border border-gray-300 p-3 rounded-2xl mb-4"
            />

            <label className="font-semibold text-base block mb-2">
  Ukuran Font Struk
</label>

<select
  value={strukFontSize}
  onChange={(e) =>
    setStrukFontSize(e.target.value)
  }
  className="w-full border border-gray-300 p-3 rounded-2xl mb-4"
>
  <option value="kecil">Kecil</option>
  <option value="sedang">Sedang</option>
  <option value="besar">Besar</option>
</select>

          </div>

          

          {/* ================= STOK ================= */}
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-6">

            <h2 className="font-bold text-[1.1em] mb-5">
              📦 Setting Stok Global
            </h2>

            <div className="space-y-4">

              {/* HIJAU */}
              <div>
                <label className="font-semibold text-[1em] block mb-2">
                  Batas Hijau
                </label>

                <input
                  type="number"
                  value={stokGreenLimit}
                  onChange={(e) =>
                    setStokGreenLimit(
                      Number(e.target.value)
                    )
                  }
                  className="w-full border border-gray-300 p-3 rounded-2xl"
                />
              </div>

              {/* ORANGE */}
              <div>
                <label className="font-semibold text-[1em] block mb-2">
                  Batas Orange
                </label>

                <input
                  type="number"
                  value={stokOrangeLimit}
                  onChange={(e) =>
                    setStokOrangeLimit(
                      Number(e.target.value)
                    )
                  }
                  className="w-full border border-gray-300 p-3 rounded-2xl"
                />
              </div>

              {/* MERAH */}
              <div>
                <label className="font-semibold text-[1em] block mb-2">
                  Batas Merah
                </label>

                <input
                  type="number"
                  value={stokRedLimit}
                  onChange={(e) =>
                    setStokRedLimit(
                      Number(e.target.value)
                    )
                  }
                  className="w-full border border-gray-300 p-3 rounded-2xl"
                />
              </div>

            </div>

          </div>

        </div>

        {/* SAVE */}
        <button
  onClick={handleSave}
  disabled={loading}
  className="mt-6 mx-auto block w-fit px-10 bg-blue-700 hover:bg-blue-800 transition text-white font-bold py-3 rounded-2xl shadow-xl"
>
  {loading ? "Menyimpan..." : "Simpan Setting"}
</button>

      </div>
      </div>
  );
}