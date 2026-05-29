"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("kasir");

  const [search, setSearch] = useState("");
  const [notif, setNotif] = useState("");

  // ===== EDIT STATE =====
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("");

  // ================= LOAD USERS =================
  const loadUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ================= TAMBAH USER =================
  const handleAdd = async () => {
    if (!name || !email || !password) {
      setNotif("❌ Semua field wajib diisi");
      setTimeout(() => setNotif(""), 3000);
      return;
    }

    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      setNotif("User berhasil diupdate");

setTimeout(() => {
  setNotif("");
}, 5000);

      setName("");
      setEmail("");
      setPassword("");
      setRole("kasir");
    } catch {
      setNotif("❌ Gagal menambah user");
      setTimeout(() => setNotif(""), 3000);
    }
  };

  // ================= START EDIT =================
  const startEdit = (user: User) => {
    setEditId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword("");
    setEditRole(user.role);
  };

  // ================= CANCEL EDIT =================
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditEmail("");
    setEditPassword("");
    setEditRole("");
  };

  // ================= SAVE EDIT =================
 const saveEdit = async (id: number) => {
  try {

    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: editName,
        email: editEmail,
        password: editPassword || undefined,
        role: editRole,
      }),
    });

    const data = await res.json();

    console.log(data);

    setEditId(null);

    loadUsers();

  } catch {
    setNotif("❌ Gagal update user");
  }
};

  // ================= DELETE USER =================
const handleDelete = async (id: number) => {

  if (!confirm("Yakin ingin hapus user ini?")) return;

  try {

    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    console.log(data);

    loadUsers();

  } catch {

    setNotif("❌ Gagal hapus");

  }
};
  return (
    <div className="flex h-screen overflow-hidden">

      {/* ================= CONTENT ================= */}
      <div className="flex-1 h-screen overflow-hidden relative">

        <div className="relative z-10 h-full flex flex-col p-2">

          {/* HEADER */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-bold text-[1.4em] mb-6 shadow">
            Manajemen User
          </div>

          {/* NOTIF */}
          {notif && (
            <div className="mb-4 p-3 rounded-xl bg-green-500 text-white font-semibold">
              {notif}
            </div>
          )}

          {/* ================= FORM ================= */}
          <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-2xl shadow-md p-5 mb-5">

            <h2 className="font-bold text-lg mb-4">
              Tambah User
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              {/* NAMA */}
              <div>
                <label className="font-semibold text-[1em]">
                  Nama
                </label>

                <input
                  type="text"
                  placeholder="Nama user"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="font-semibold text-[1em]">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Email user"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="font-semibold text-[1em]">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="font-semibold text-[1em]">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                >
                  <option value="admin">Admin</option>
                  <option value="kasir">Kasir</option>
                </select>
              </div>

            </div>

            {/* BUTTON */}
            <div className="mt-5">
              <button
                onClick={handleAdd}
                className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold"
              >
                + Tambah User
              </button>
            </div>

          </div>

          {/* ================= SEARCH ================= */}
          <input
            type="text"
            placeholder="Cari user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl border bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          {/* ================= TABLE ================= */}
          <div className="flex-1 overflow-hidden">

            <div className="h-full overflow-y-auto rounded-xl">

              <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-xl shadow-md">

                <table className="w-full">

                  {/* HEADER */}
                  <thead className="bg-gray-900 text-white sticky top-0 z-10">
                    <tr>

                      <th className="p-3 border border-gray-700 font-bold">
                        ID
                      </th>

                      <th className="p-3 border border-gray-700 font-bold">
                        Nama
                      </th>

                      <th className="p-3 border border-gray-700 font-bold">
                        Email
                      </th>

                      <th className="p-3 border border-gray-700 font-bold">
  Role
</th>

<th className="p-3 border border-gray-700 font-bold">
  Password
</th>

                      <th className="p-3 border border-gray-700 font-bold">
                        Aksi
                      </th>

                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>

                   {users
  .filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )
  .map((user) => (
    <tr key={user.id} className="border-t">

      <td className="p-3 text-center">{user.id}</td>

      {/* NAMA */}
      <td className="p-3">
        {editId === user.id ? (
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="border p-2 rounded w-full"
          />
        ) : (
          user.name
        )}
      </td>

      {/* EMAIL */}
      <td className="p-3">
        {editId === user.id ? (
          <input
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
        ) : (
          user.email
        )}
      </td>
{/* ROLE */}
<td className="p-3 text-center">
  {editId === user.id ? (
    <select
      value={editRole}
      onChange={(e) => setEditRole(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="admin">Admin</option>
      <option value="kasir">Kasir</option>
    </select>
  ) : (
    user.role
  )}
</td>

{/* PASSWORD (BARU) */}
<td className="p-3">
  {editId === user.id ? (
    <input
      type="password"
      placeholder="Password baru (opsional)"
      value={editPassword}
      onChange={(e) => setEditPassword(e.target.value)}
      className="border p-2 rounded w-full"
    />
  ) : (
    "••••••"
  )}
</td>

      {/* AKSI */}
      <td className="p-3">
        <div className="flex gap-2 justify-center">

          {editId === user.id ? (
            <>
              <button
                onClick={() => saveEdit(user.id)}
                className="bg-green-600 text-white px-3 py-2 rounded"
              >
                Simpan
              </button>

              <button
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-3 py-2 rounded"
              >
                Batal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => startEdit(user)}
                className="bg-yellow-500 text-white px-3 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-600 text-white px-3 py-2 rounded"
              >
                Hapus
              </button>
            </>
          )}

        </div>
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
  );
}