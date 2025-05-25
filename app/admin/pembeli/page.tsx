'use client';
import { useEffect, useRef, useState } from 'react';
import { FiSearch, FiFilter, FiTrash2 } from 'react-icons/fi';
import { HiOutlineDownload } from 'react-icons/hi';
import html2pdf from 'html2pdf.js';
import Papa from 'papaparse';

export default function UserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportTable, setShowExportTable] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:7000/api/user');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
      else setUsers(data.users || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
    try {
      await fetch(`http://localhost:7000/api/hapus/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      (u.address || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  const exportPDF = async () => {
    setShowExportTable(true);
    await new Promise((r) => setTimeout(r, 120));
    if (tableRef.current) {
      const opt = {
        margin: 0.5,
        filename: 'users.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };
      await html2pdf().from(tableRef.current).set(opt).save();
    }
    setShowExportTable(false);
  };

  const exportCSV = () => {
    if (!filteredUsers.length) return alert('Data user kosong!');
    const csvData = filteredUsers.map(u => ({
      ID: u.id,
      Username: u.username,
      Phone: u.phone,
      Email: u.email,
      Address: u.address || '-',
      Role: u.role || '-'
    }));
    const csv = Papa.unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex ml-64 h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Cari user, email, phone, address, role..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-100 bg-white focus:ring-2 focus:ring-pink-300 text-gray-700 font-semibold shadow"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-xl text-pink-400" />
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 bg-blue-300 text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              <HiOutlineDownload className="text-lg" />
              Export PDF
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-green-300 text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              <HiOutlineDownload className="text-lg" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Tabel khusus export PDF (tanpa kolom action), hidden di web */}
        {showExportTable && (
          <div ref={tableRef} className="bg-white rounded-xl shadow-md p-4 mb-8">
            <h2 className="text-xl font-extrabold text-pink-700 mb-4">Daftar User</h2>
            <table className="w-full table-auto">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-bold text-blue-700">{u.id}</td>
                    <td className="font-semibold">{u.username}</td>
                    <td>{u.phone}</td>
                    <td>{u.email}</td>
                    <td>{u.address || '-'}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          u.role === "admin"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-pink-100 text-pink-700 border border-pink-200"
                        }
                      `}>
                        {u.role || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">
                      Tidak ada user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tabel utama (tampil web, ada kolom action) */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-extrabold text-pink-700 mb-4">Manajemen Akun</h2>
          <table className="w-full table-auto">
            <thead className="bg-pink-100 text-left text-pink-700 border-b">
              <tr>
                <th className="py-2">ID</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b hover:bg-yellow-50 transition">
                  <td className="py-3 font-bold text-blue-700">{u.id}</td>
                  <td className="font-semibold">{u.username}</td>
                  <td>{u.phone}</td>
                  <td>{u.email}</td>
                  <td>{u.address || '-'}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        u.role === "admin"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-pink-100 text-pink-700 border border-pink-200"
                      }
                    `}>
                      {u.role || '-'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                      onClick={() => handleDelete(u.id)}
                      title="Hapus User"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    Tidak ada user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}