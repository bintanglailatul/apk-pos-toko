"use client";

import { useEffect, useState } from "react";

export default function SettingKasir() {
  // ================= BACKGROUND =================
  const [kasirBackgroundColor, setKasirBackgroundColor] = useState("#0f172a");
  const [kasirBackgroundImage, setKasirBackgroundImage] = useState("");
  const [kasirBackgroundOpacity, setKasirBackgroundOpacity] = useState(0.3);

  // ================= FONT =================
  const [kasirFontSize, setKasirFontSize] = useState("sedang");

  // ================= UI =================
  const [notif, setNotif] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOAD =================
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;

        setKasirBackgroundColor(data.kasirBackgroundColor || "#0f172a");
        setKasirBackgroundImage(data.kasirBackgroundImage || "");
        setKasirBackgroundOpacity(data.kasirBackgroundOpacity ?? 0.3);
        setKasirFontSize(data.kasirFontSize || "sedang");
      });
  }, []);

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kasirBackgroundColor,
          kasirBackgroundImage,
          kasirBackgroundOpacity,
          kasirFontSize,
        }),
      });

      if (!res.ok) throw new Error();

      // LOCAL STORAGE (BIAR LANGSUNG KEPANGGIL DI LAYOUT)
      localStorage.setItem("kasirBackgroundColor", kasirBackgroundColor);
      localStorage.setItem("kasirBackgroundImage", kasirBackgroundImage);
      localStorage.setItem("kasirBackgroundOpacity", String(kasirBackgroundOpacity));
      localStorage.setItem("kasirFontSize", kasirFontSize);

      setNotif("✅ Setting kasir berhasil disimpan");
    } catch (err) {
      setNotif("❌ Gagal menyimpan setting");
    } finally {
      setLoading(false);
      setTimeout(() => setNotif(""), 3000);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto p-2">

        {/* HEADER */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.5em] mb-6 shadow">
          Setting Kasir
        </div>

        {/* NOTIF */}
        {notif && (
          <div className="mb-4 p-3 rounded-2xl text-white bg-green-500 font-semibold">
            {notif}
          </div>
        )}

        {/* WRAPPER */}
<div className="flex flex-col gap-6">

  {/* ================= BACKGROUND ================= */}
  <div className="bg-white/95 backdrop-blur-md border rounded-3xl shadow-xl p-6">

    <h2 className="font-bold text-[1em] text-lg mb-4">
      🎨 Background Kasir
    </h2>

    {/* COLOR */}
    <label className="text-[1em] font-semibold block mb-2">
      Warna Background
    </label>

    <input
      type="color"
      value={kasirBackgroundColor}
      onChange={(e) => setKasirBackgroundColor(e.target.value)}
      className="w-full h-12 rounded-xl border mb-4"
    />

    {/* IMAGE */}
    <label className="text-[1em] font-semibold block mb-2">
      Gambar Background
    </label>

    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
          setKasirBackgroundImage(reader.result as string);
        };

        reader.readAsDataURL(file);
      }}
      className="w-full mb-4 text-[0.9em] font-medium"
    />

    {/* OPACITY */}
    <label className="text-[1em] font-semibold block mb-2">
      Kecerahan Background
    </label>

    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={kasirBackgroundOpacity}
      onChange={(e) =>
        setKasirBackgroundOpacity(Number(e.target.value))
      }
      className="w-full accent-blue-600"
    />

    <p className="text-sm text-gray-500 mt-1">
      {Math.round(kasirBackgroundOpacity * 100)}%
    </p>

    {/* PREVIEW */}
    <div
      className="relative h-40 rounded-2xl overflow-hidden border mt-4"
      style={{ backgroundColor: kasirBackgroundColor }}
    >
      {kasirBackgroundImage && (
        <img
          src={kasirBackgroundImage}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: kasirBackgroundOpacity }}
        />
      )}
    </div>

  </div>

  {/* ================= FONT ================= */}
  <div className="bg-white/95 backdrop-blur-md border rounded-3xl shadow-xl p-6">

    <h2 className="text-[1em] font-bold text-lg mb-4 ">
      🔤 Font Kasir
    </h2>

    <label className="text-[1em] font-semibold block mb-2">
      Ukuran Font Global
    </label>

    <select
      value={kasirFontSize}
      onChange={(e) => setKasirFontSize(e.target.value)}
      className="w-full border p-3 rounded-2xl "
    >
      <option value="kecil">Kecil</option>
      <option value="sedang">Sedang</option>
      <option value="besar">Besar</option>
    </select>

    <p className="text-sm text-gray-500 mt-3">
      Setting ini mempengaruhi semua halaman kasir
    </p>

  </div>

</div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 w-full md:w-auto px-10 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl shadow"
        >
          {loading ? "Menyimpan..." : "Simpan Setting"}
        </button>

      </div>
    </div>
  );
}