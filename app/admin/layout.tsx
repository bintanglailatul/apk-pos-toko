"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [settings, setSettings] = useState<any>(null);
  const [stokMerah, setStokMerah] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);

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

  // ================= LOAD STOK =================
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const merah = data.filter(
          (item: any) =>
            item.stok <= (item.stokMerah || 5)
        );

        setStokMerah(merah);

        if (merah.length > 0) {
          setShowNotif(true);

          setTimeout(() => {
            setShowNotif(false);
          }, 5000);
        }
      })
      .catch(console.log);
  }, []);

  const isActive = (path: string) =>
    pathname === path;

  const menuClass = (path: string) =>
  `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl transition-all duration-200 text-[1em] font-medium ${
    isActive(path)
      ? "bg-blue-700 text-white shadow-lg"
      : "text-gray-200 hover:bg-slate-800"
  }`;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        fontSize:
          settings?.adminFontSize === "kecil"
            ? "11px"
            : settings?.adminFontSize === "besar"
            ? "18px"
            : "14px",
      }}
    >

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-30">

        {/* TOKO */}
        <div className="bg-blue-700 p-5 text-center font-bold text-[1.4em] shadow">
          {settings?.namaToko || "Toko Saya"}
        </div>

        {/* ADMIN */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">

          <div className="flex items-center gap-3">

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
              <p className="font-semibold text-[1.2em]">
                Admin
              </p>

              <p className="text-[0.95em] text-gray-400">
                Dashboard
              </p>
            </div>

          </div>

          {/* NOTIF */}
          <button
            onClick={() =>
              router.push("/admin/notifikasi")
            }
            className="relative text-[1.8em] hover:scale-110 transition"
          >
            🔔

            {stokMerah.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white min-w-7 h-7 px-1 rounded-full flex items-center justify-center font-bold shadow text-[0.6em]">
                {stokMerah.length}
              </span>
            )}

          </button>

        </div>

        {/* ================= MENU ================= */}
 <nav className="flex-1 p-3 flex flex-col">

  {/* MENU ATAS */}
  <div className="space-y-2">

    <button
      onClick={() => router.push("/admin/dashboard")}
      className={menuClass("/admin/dashboard")}
    >
      📊 Dashboard
    </button>

    <button
      onClick={() => router.push("/admin/data_barang")}
      className={menuClass("/admin/data_barang")}
    >
      📦 Data Barang
    </button>
    <button
              onClick={() => router.push("/admin/hutang")}
              className={menuClass("/admin/hutang")}
            >
              📋 Hutang
            </button>

    <button
              onClick={() => router.push("/admin/pengeluaran")}
              className={menuClass("/admin/pengeluaran")}
            >
              💸 Pengeluaran
            </button>

    <button
      onClick={() => router.push("/admin/laporan_admin")}
      className={menuClass("/admin/laporan_admin")}
    >
      📑 Laporan
    </button>

    <button
  onClick={() => router.push("/admin/users")}
  className={menuClass("/admin/users")}
>
  👤 User
</button>

{/* SETTING */}
  <button
    onClick={() => router.push("/admin/setting")}
    className={menuClass("/admin/setting")}
  >
    ⚙️ Setting
  </button>

  

  </div>

  {/* PUSH KE BAWAH */}
  <div className="flex-1" />

  {/* GARIS */}
  <div className="border-t border-slate-700 mb-4" />

    <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-3 text-left p-3 rounded-2xl transition-all duration-200 hover:bg-red-600 text-[1em]"
                >
                  🚪 Keluar
                </button>

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
                settings?.adminBackgroundColor || "#0f172a",
            }}
          />

          {/* IMAGE */}
          {settings?.adminBackgroundImage && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${settings.adminBackgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity:
                  settings?.adminBackgroundOpacity ?? 0.4,
              }}
            />
          )}

        </div>

        {/* NOTIFIKASI */}
        {showNotif && stokMerah.length > 0 && (
          <div className="fixed top-5 right-5 z-50 bg-red-600 text-white px-5 py-4 rounded-2xl shadow-2xl border border-red-300 animate-pulse">

            <div className="font-bold text-[1.1em] mb-1">
              ⚠️ Peringatan Stok
            </div>

            <div className="text-[1em]">
              Ada {stokMerah.length} barang stok merah
            </div>

          </div>
        )}

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