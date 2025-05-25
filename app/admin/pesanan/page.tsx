'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import Papa from 'papaparse';
import { FiRefreshCw, FiSearch, FiFileText, FiDownload, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

const statusBadge = (status: string) => {
  let base = "inline-flex items-center px-3 py-1 rounded-full font-bold text-xs shadow";
  switch (status) {
    case "completed":
      return <span className={base + " bg-green-100 text-green-700 border border-green-200"}><FiCheck className="mr-1" /> Selesai</span>;
    case "pending":
      return <span className={base + " bg-yellow-100 text-yellow-700 border border-yellow-200"}><FiRefreshCw className="mr-1 animate-spin" /> Pending</span>;
    case "processing":
      return <span className={base + " bg-blue-100 text-blue-700 border border-blue-200"}><FiEdit2 className="mr-1" /> Diproses</span>;
    default:
      return <span className={base + " bg-red-100 text-red-700 border border-red-200"}><FiX className="mr-1" /> Dibatalkan</span>;
  }
};

const AdminCheckoutList = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportTable, setShowExportTable] = useState(false);

  const tableRef = useRef(null);
  const token = (typeof window !== "undefined") ? localStorage.getItem('accessToken') : "";

  const fetchCheckouts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:7000/api/checkouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = (res.data.data || []).map(co => ({
        ...co,
        products: Array.isArray(co.items)
          ? co.items.map(item => ({
              name: item.produk?.name || '-',
              qty: item.quantity || 0,
              harga: item.harga || item.produk?.harga || 0,
              ukuran: item.ukuran || '-',
            }))
          : []
      }));
      setCheckouts(data);
      setLoading(false);
    } catch (err) {
      setError('Gagal mengambil data pesanan');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckouts();
    // eslint-disable-next-line
  }, []);

  const handleStatusChange = (checkoutId, newStatus) => {
    setStatusUpdate(prev => ({ ...prev, [checkoutId]: newStatus }));
  };

  const handleUpdateClick = async (checkoutId) => {
    if (!statusUpdate[checkoutId]) {
      alert('Pilih status baru terlebih dahulu');
      return;
    }
    setUpdatingId(checkoutId);
    try {
      await axios.put(`http://localhost:7000/api/checkout/${checkoutId}`, 
        { status: statusUpdate[checkoutId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Status berhasil diupdate');
      fetchCheckouts();
    } catch (err) {
      alert('Gagal update status pesanan');
      console.error(err);
    }
    setUpdatingId(null);
  };

  const handleDelete = async (checkoutId) => {
    if (!confirm('Yakin ingin menghapus pesanan ini?')) return;
    try {
      await axios.delete(`http://localhost:7000/api/checkout/${checkoutId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Pesanan berhasil dihapus');
      fetchCheckouts();
    } catch (err) {
      alert('Gagal menghapus pesanan');
      console.error(err);
    }
  };

  const filteredCheckouts = checkouts.filter(co => {
    const q = searchQuery.toLowerCase();
    return (
      co.order_code.toLowerCase().includes(q) ||
      co.receiver_name.toLowerCase().includes(q) ||
      co.status.toLowerCase().includes(q) ||
      (co.products || []).some(
        p => p.name.toLowerCase().includes(q)
      )
    );
  });

  const formatIDR = (amount) => {
    if (typeof amount !== 'number') amount = Number(amount) || 0;
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  const exportPDF = async () => {
    setShowExportTable(true);
    await new Promise(r => setTimeout(r, 120));
    if (tableRef.current) {
      const opt = {
        margin: 0.5,
        filename: 'checkouts.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };
      await html2pdf().from(tableRef.current).set(opt).save();
    }
    setShowExportTable(false);
  };

  const exportCSV = () => {
    if (!filteredCheckouts.length) return alert('Data pesanan kosong!');
    const csvData = filteredCheckouts.map(co => ({
      ID: co.id,
      OrderCode: co.order_code,
      Receiver: co.receiver_name,
      Total: co.total_amount,
      Status: co.status,
      Produk: (co.products || []).map(p => `${p.name} x${p.qty} (${p.ukuran})`).join(', ')
    }));
    const csv = Papa.unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'checkouts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 rounded-2xl shadow mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-400 mb-4"></div>
        <span className="text-pink-600 font-bold">Memuat data pesanan...</span>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-red-500">{error}</span>
      </div>
    );

  return (
    <div className="max-w-6xl mt-0 ml-64 mx-auto px-4 py-10 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 rounded-3xl shadow-xl mt-10">
      <h2 className="text-3xl font-extrabold mb-8 text-pink-700 tracking-wide flex items-center gap-3">
        <FiFileText className="text-2xl" />
        Admin - Daftar Pesanan
      </h2>

      {/* Search dan tombol export */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center w-full md:w-1/3 bg-white rounded-lg border-2 border-pink-100 shadow px-3 py-2 gap-2">
          <FiSearch className="text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Cari order code, penerima, status, produk..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
          >
            <FiDownload /> Export PDF
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-300 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabel export (khusus PDF, hidden di web) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -1, width: '100%' }}>
        {showExportTable && (
          <div ref={tableRef}>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border font-semibold">ID</th>
                  <th className="p-2 border font-semibold">Order Code</th>
                  <th className="p-2 border font-semibold">Penerima</th>
                  <th className="p-2 border font-semibold">Total</th>
                  <th className="p-2 border font-semibold">Status</th>
                  <th className="p-2 border font-semibold">Produk</th>
                </tr>
              </thead>
              <tbody>
                {filteredCheckouts.map(co => (
                  <tr key={co.id}>
                    <td className="p-2 border">{co.id}</td>
                    <td className="p-2 border">{co.order_code}</td>
                    <td className="p-2 border">{co.receiver_name}</td>
                    <td className="p-2 border">{formatIDR(co.total_amount)}</td>
                    <td className="p-2 border">{co.status}</td>
                    <td className="p-2 border">
                      <ul>
                        {(co.products || []).map((p, i) =>
                          <li key={i}>
                            {p.name} x{p.qty} ({p.ukuran})
                          </li>
                        )}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tabel utama */}
      <div className="overflow-x-auto rounded-2xl shadow-lg mt-2">
        <table className="min-w-full bg-white border border-gray-200 rounded-2xl">
          <thead>
            <tr className="bg-pink-100 border-b">
              <th className="p-3 font-semibold text-pink-700">Order Code</th>
              <th className="p-3 font-semibold text-pink-700">Penerima</th>
              <th className="p-3 font-semibold text-pink-700">Total</th>
              <th className="p-3 font-semibold text-pink-700">Status</th>
              <th className="p-3 font-semibold text-pink-700">Produk</th>
              <th className="p-3 font-semibold text-pink-700">Ubah Status</th>
              <th className="p-3 font-semibold text-pink-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCheckouts.map(co => (
              <tr key={co.id} className="border-b hover:bg-pink-50 transition">
                <td className="p-3 font-mono font-bold text-blue-700">{co.order_code}</td>
                <td className="p-3">{co.receiver_name}</td>
                <td className="p-3 font-bold text-green-700">{formatIDR(co.total_amount)}</td>
                <td className="p-3">{statusBadge(co.status)}</td>
                <td className="p-3">
                  <ul className="list-disc pl-4 text-sm text-gray-700">
                    {(co.products || []).map((p, i) =>
                      <li key={i}>
                        {p.name} <span className="font-semibold text-xs text-pink-700">x{p.qty} ({p.ukuran})</span>
                      </li>
                    )}
                  </ul>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={statusUpdate[co.id] || co.status}
                      onChange={e => handleStatusChange(co.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none shadow"
                    >
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <button
                      onClick={() => handleUpdateClick(co.id)}
                      disabled={updatingId === co.id}
                      className={`bg-tomat text-white px-3 py-1 rounded-lg hover:scale-105 transition disabled:opacity-50 flex items-center gap-1`}
                      title="Update Status"
                    >
                      <FiCheck />
                      {updatingId === co.id ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(co.id)}
                    className="flex items-center gap-1 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                    title="Hapus"
                  >
                    <FiTrash2 />
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filteredCheckouts.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-400">
                  Tidak ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCheckoutList;