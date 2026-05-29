"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // simpan role (lebih aman dari string "Admin")
        localStorage.setItem(
  "user",
  JSON.stringify({
    id: data.id,
    name: data.name,
    role: data.role,
  })
);

        if (data.role === "admin") {
          router.push("/admin/dashboard");
        } else if (data.role === "kasir") {
          router.push("/kasir/dashboard");
        }
      } else {
        alert(data.message || "Login gagal!");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="w-[1000px] h-[600px] flex rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT */}
        <div className="w-1/2 relative flex items-center justify-center text-white overflow-hidden">

          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/batik.png')",
              filter: "invert(1) brightness(1.2)",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-blue-700/80" />

          <div className="relative z-10 text-center px-10">
            <h1 className="text-3xl font-bold mb-2">BARU MUNCUL</h1>
            <h2 className="text-lg font-medium mb-6 text-gray-200">
              Toko ATK & Jasa Cetak
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Sistem Point of Sale untuk pencatatan penjualan, pengelolaan stok, dan laporan keuangan secara otomatis.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-white flex flex-col justify-center px-16">

          <h2 className="text-2xl font-bold mb-1 text-gray-800 text-center">
            Login
          </h2>

          <p className="text-gray-400 mb-6 text-center">
            Masukkan akun untuk melanjutkan
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl"
            >
              {loading ? "Loading..." : "Login"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}