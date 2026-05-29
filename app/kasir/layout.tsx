"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function KasirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [settings, setSettings] = useState<any>(null);

  // ================= LOAD SETTINGS =================
  useEffect(() => {
    const loadSettings = () => {
      fetch("/api/settings")
        .then((res) => res.json())
        .then(setSettings)
        .catch(console.log);
    };

    loadSettings();

    const interval = setInterval(() => {
      loadSettings();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ================= ACTIVE MENU =================
  const isActive = (path: string) => pathname === path;

  const menuClass = (path: string) =>
    `w-full flex items-center gap-3 text-left p-3 rounded-2xl transition-all duration-200 text-[1em] ${
      isActive(path)
        ? "bg-blue-700 text-white shadow-lg"
        : "hover:bg-slate-800 text-gray-200"
    }`;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        fontSize:
          settings?.kasirFontSize === "kecil"
            ? "11px"
            : settings?.kasirFontSize === "besar"
            ? "18px"
            : "14px",
      }}
    >
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-30">

        {/* TOKO */}
        <div className="bg-blue-700 p-5 text-center font-bold text-[1.3em] shadow">
          {settings?.namaToko || "Kasir"}
        </div>

        {/* USER */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-700">

          {settings?.logoToko ? (
            <img
              src={settings.logoToko}
              alt="Logo"
              className="w-11 h-11 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-white" />
          )}

          <div>
            <p className="font-semibold text-[1.1em]">
              Kasir
            </p>

            <p className="text-[0.9em] text-gray-400">
              Sistem POS
            </p>
          </div>

        </div>

        {/* ================= MENU ================= */}
        <nav className="flex-1 p-3 flex flex-col">

          {/* MENU ATAS */}
          <div className="space-y-2">

            <button
              onClick={() => router.push("/kasir/dashboard")}
              className={menuClass("/kasir/dashboard")}
            >
              📊 Dashboard
            </button>

            <button
              onClick={() => router.push("/kasir/transaksi")}
              className={menuClass("/kasir/transaksi")}
            >
              🛒 Transaksi
            </button>

            <button
              onClick={() => router.push("/kasir/pengeluaran")}
              className={menuClass("/kasir/pengeluaran")}
            >
              💸 Pengeluaran
            </button>

            <button
              onClick={() => router.push("/kasir/cek_stok")}
              className={menuClass("/kasir/cek_stok")}
            >
              📦 Cek Stok
            </button>

            <button
              onClick={() => router.push("/kasir/hutang")}
              className={menuClass("/kasir/hutang")}
            >
              📋 Hutang
            </button>

            {/* SETTING */}
            <button
              onClick={() => router.push("/kasir/setting")}
              className={menuClass("/kasir/setting")}
            >
              ⚙️ Setting
            </button>

          </div>

          {/* ================= BAWAH ================= */}
          <div className="mt-auto pt-4 border-t border-slate-700 space-y-2">

             <button
              onClick={() => {
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="w-full flex items-center gap-3 text-left p-3 rounded-2xl transition-all duration-200 hover:bg-red-600 text-[1em]"
            >
              🚪 Keluar
            </button>
          </div>

        </nav>

      </aside>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 relative overflow-hidden">

        {/* BACKGROUND */}
        <div className="fixed inset-0 -z-10">

          {/* COLOR */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor:
                settings?.kasirBackgroundColor || "#0f172a",
            }}
          />

          {/* IMAGE */}
          {settings?.kasirBackgroundImage && (
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `url(${settings.kasirBackgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      opacity: settings?.kasirBackgroundOpacity ?? 0.4,
    }}
  />
)}

        </div>

        {/* CONTENT */}
        <div className="relative z-10 h-full overflow-y-auto p-3 custom-scroll bg-transparent">

          <div className="min-h-full">
            {children}
          </div>

        </div>

      </main>
    </div>
  );
}