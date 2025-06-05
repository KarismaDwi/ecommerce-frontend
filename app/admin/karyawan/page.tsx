'use client';
import { useEffect, useRef, useState } from 'react';
import { FiSearch, FiFilter, FiTrash2, FiPlus } from 'react-icons/fi';
import { HiOutlineDownload } from 'react-icons/hi';
import html2pdf from 'html2pdf.js';
import Papa from 'papaparse';

export default function EmployeePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportTable, setShowExportTable] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    role: 'karyawan'
  });

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken'); // Ambil token dari localStorage
    if (!accessToken) throw new Error('Token tidak ditemukan');

    const res = await fetch('http://localhost:7000/api/employees', {
      headers: {
        'Authorization': `Bearer ${accessToken}` // Sertakan token di header
      }
    });

    if (!res.ok) throw new Error('Gagal mengambil data');
    const data = await res.json();
    setEmployees(data);
  } catch (err) {
    console.error('Error:', err);
    alert('Error: ' + err.message);
  }
};

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus karyawan ini?')) return;
    try {
      await fetch(`http://localhost:7000/api/hapus/${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:7000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        fetchEmployees();
        setShowAddForm(false);
        setNewEmployee({
          username: '',
          phone: '',
          email: '',
          password: '',
          address: '',
          role: 'karyawan'
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Gagal menambahkan karyawan');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Terjadi kesalahan saat menambahkan karyawan');
    }
  };

  const filteredEmployees = employees.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      (u.address || '').toLowerCase().includes(q)
    );
  });

  const exportPDF = async () => {
    setShowExportTable(true);
    await new Promise((r) => setTimeout(r, 120));
    if (tableRef.current) {
      const opt = {
        margin: 0.5,
        filename: 'employees.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };
      await html2pdf().from(tableRef.current).set(opt).save();
    }
    setShowExportTable(false);
  };

  const exportCSV = () => {
    if (!filteredEmployees.length) return alert('Data karyawan kosong!');
    const csvData = filteredEmployees.map(u => ({
      ID: u.id,
      Username: u.username,
      Phone: u.phone,
      Email: u.email,
      Address: u.address || '-',
    }));
    const csv = Papa.unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees.csv');
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
              placeholder="Cari karyawan..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-100 bg-white focus:ring-2 focus:ring-pink-300 text-gray-700 font-semibold shadow"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-pink-500 text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              <FiPlus className="text-lg" />
              Tambah Karyawan
            </button>
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

        {/* Add Employee Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Tambah Karyawan Baru</h2>
              <form onSubmit={handleAddEmployee}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newEmployee.username}
                    onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newEmployee.address}
                    onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-500 text-white rounded"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabel khusus export PDF */}
        {showExportTable && (
          <div ref={tableRef} className="bg-white rounded-xl shadow-md p-4 mb-8">
            <h2 className="text-xl font-extrabold text-pink-700 mb-4">Daftar Karyawan</h2>
            <table className="w-full table-auto">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredEmployees.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-bold text-blue-700">{u.id}</td>
                    <td className="font-semibold">{u.username}</td>
                    <td>{u.phone}</td>
                    <td>{u.email}</td>
                    <td>{u.address || '-'}</td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      Tidak ada karyawan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tabel utama */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-extrabold text-pink-700 mb-4">Manajemen Karyawan</h2>
          <table className="w-full table-auto">
            <thead className="bg-pink-100 text-left text-pink-700 border-b">
              <tr>
                <th className="py-2">ID</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredEmployees.map((u) => (
                <tr key={u.id} className="border-b hover:bg-yellow-50 transition">
                  <td className="py-3 font-bold text-blue-700">{u.id}</td>
                  <td className="font-semibold">{u.username}</td>
                  <td>{u.phone}</td>
                  <td>{u.email}</td>
                  <td>{u.address || '-'}</td>
                  <td>
                    <button
                      className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                      onClick={() => handleDelete(u.id)}
                      title="Hapus Karyawan"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    Tidak ada karyawan.
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