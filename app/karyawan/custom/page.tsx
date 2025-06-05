'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import Papa from 'papaparse';
import { FiSearch, FiDownload, FiCheckCircle, FiX, FiEdit2, FiLoader, FiTrash2, FiAlertCircle, FiImage } from 'react-icons/fi';

const statusBadge = (status: string) => {
  let base = "inline-flex items-center px-3 py-1 rounded-full font-bold text-xs shadow";
  switch (status) {
    case "completed":
      return <span className={base + " bg-green-100 text-green-700 border border-green-200"}><FiCheckCircle className="mr-1" /> Selesai</span>;
    case "pending":
      return <span className={base + " bg-yellow-100 text-yellow-700 border border-yellow-200"}><FiLoader className="mr-1 animate-spin" /> Pending</span>;
    case "processing":
      return <span className={base + " bg-blue-100 text-blue-700 border border-blue-200"}><FiEdit2 className="mr-1" /> Diproses</span>;
    default:
      return <span className={base + " bg-red-100 text-red-700 border border-red-200"}><FiX className="mr-1" /> Dibatalkan</span>;
  }
};

const AdminCustomOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportTable, setShowExportTable] = useState(false);

  const tableRef = useRef(null);
  const token = (typeof window !== "undefined") ? localStorage.getItem('accessToken') : "";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:7000/api/custom-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data || res.data || []);
      setLoading(false);
    } catch (err) {
      setError('Gagal mengambil data custom order');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdate(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateClick = async (orderId) => {
    if (!statusUpdate[orderId]) {
      alert('Pilih status baru terlebih dahulu');
      return;
    }
    setUpdatingId(orderId);
    try {
      await axios.put(`http://localhost:7000/api/custom-order/${orderId}`, 
        { status: statusUpdate[orderId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Status berhasil diupdate');
      fetchOrders();
    } catch (err) {
      alert('Gagal update status custom order');
      console.error(err);
    }
    setUpdatingId(null);
  };

  const handleDelete = async (orderId) => {
    if (!confirm('Yakin ingin menghapus custom order ini?')) return;
    try {
      await axios.delete(`http://localhost:7000/api/custom-order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Custom order berhasil dihapus');
      fetchOrders();
    } catch (err) {
      alert('Gagal menghapus custom order');
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase();
    return (
      (order.username && order.username.toLowerCase().includes(q)) ||
      (order.email && order.email.toLowerCase().includes(q)) ||
      (order.status && order.status.toLowerCase().includes(q)) ||
      (order.flowerType && order.flowerType.toLowerCase().includes(q)) ||
      (order.arrangement && order.arrangement.toLowerCase().includes(q))
    );
  });

  const formatIDR = (amount) => {
    if (typeof amount !== 'number') amount = Number(amount) || 0;
    return 'Rp ' + amount.toLocaleString('id-ID');
  };
  const formatDate = (date) => date ? new Date(date).toLocaleString('id-ID') : '-';

  const exportPDF = async () => {
    setShowExportTable(true);
    await new Promise(r => setTimeout(r, 120));
    if (tableRef.current) {
      const opt = {
        margin: 0.5,
        filename: 'custom-orders.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };
      await html2pdf().from(tableRef.current).set(opt).save();
    }
    setShowExportTable(false);
  };

  const exportCSV = () => {
    if (!filteredOrders.length) return alert('Data custom order kosong!');
    const csvData = filteredOrders.map(order => ({
      ID: order.id,
      Nama: order.username,
      Email: order.email,
      Status: order.status,
      JenisBunga: order.flowerType,
      Warna: order.flowerColor,
      Ukuran: order.size,
      Rangkaian: order.arrangement,
      TanggalKirim: formatDate(order.deliveryDate),
      TanggalOrder: formatDate(order.createdAt),
      Gambar: order.imagePath ? `http://localhost:7000${order.imagePath}` : '-',
    }));
    const csv = Papa.unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'custom-orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 rounded-2xl shadow mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-400 mb-4"></div>
        <span className="text-pink-600 font-bold">Memuat data custom order...</span>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-red-500">{error}</span>
      </div>
    );

  return (
    <div className="mt-0 max-w-6xl ml-72 mx-auto px-4 py-10 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 rounded-3xl shadow-xl mt-10">
      <h2 className="text-3xl font-extrabold mb-8 text-pink-700 tracking-wide flex items-center gap-3">
        Admin - Daftar Custom Order
      </h2>

      {/* Search dan tombol export */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center w-full md:w-1/3 bg-white rounded-lg border-2 border-pink-100 shadow px-3 py-2 gap-2">
          <FiSearch className="text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Cari nama, email, status, bunga, rangkaian..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-blue-300 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
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
                  <th className="p-2 border font-semibold">Nama</th>
                  <th className="p-2 border font-semibold">Email</th>
                  <th className="p-2 border font-semibold">Status</th>
                  <th className="p-2 border font-semibold">Jenis Bunga</th>
                  <th className="p-2 border font-semibold">Warna</th>
                  <th className="p-2 border font-semibold">Ukuran</th>
                  <th className="p-2 border font-semibold">Rangkaian</th>
                  <th className="p-2 border font-semibold">Tgl Kirim</th>
                  <th className="p-2 border font-semibold">Tgl Order</th>
                  <th className="p-2 border font-semibold">Gambar</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="p-2 border">{order.id}</td>
                    <td className="p-2 border">{order.username}</td>
                    <td className="p-2 border">{order.email}</td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border">{order.flowerType}</td>
                    <td className="p-2 border">{order.flowerColor}</td>
                    <td className="p-2 border">{order.size}</td>
                    <td className="p-2 border">{order.arrangement}</td>
                    <td className="p-2 border">{formatDate(order.deliveryDate)}</td>
                    <td className="p-2 border">{formatDate(order.createdAt)}</td>
                    <td className="p-2 border">
                      {order.imagePath ? (
                        <img
                          src={`http://localhost:7000${order.imagePath}`}
                          alt="gambar custom"
                          className="w-16 h-16 object-cover rounded shadow mx-auto"
                        />
                      ) : (
                        "-"
                      )}
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
              <th className="p-3 font-semibold text-pink-700">Nama</th>
              <th className="p-3 font-semibold text-pink-700">Email</th>
              <th className="p-3 font-semibold text-pink-700">Status</th>
              <th className="p-3 font-semibold text-pink-700">Jenis Bunga</th>
              <th className="p-3 font-semibold text-pink-700">Warna</th>
              <th className="p-3 font-semibold text-pink-700">Ukuran</th>
              <th className="p-3 font-semibold text-pink-700">Rangkaian</th>
              <th className="p-3 font-semibold text-pink-700">Tgl Kirim</th>
              <th className="p-3 font-semibold text-pink-700">Tgl Order</th>
              <th className="p-3 font-semibold text-pink-700">Gambar</th>
              <th className="p-3 font-semibold text-pink-700">Ubah Status</th>
              <th className="p-3 font-semibold text-pink-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-b hover:bg-yellow-50 transition">
                <td className="p-3 font-semibold">{order.username}</td>
                <td className="p-3">{order.email}</td>
                <td className="p-3">{statusBadge(order.status)}</td>
                <td className="p-3">{order.flowerType}</td>
                <td className="p-3">{order.flowerColor}</td>
                <td className="p-3">{order.size}</td>
                <td className="p-3">{order.arrangement}</td>
                <td className="p-3">{formatDate(order.deliveryDate)}</td>
                <td className="p-3">{formatDate(order.createdAt)}</td>
                <td className="p-3">
                  {order.imagePath ? (
                    <img
                      src={`http://localhost:7000${order.imagePath}`}
                      alt="gambar custom"
                      className="w-16 h-16 object-cover rounded shadow mx-auto"
                    />
                  ) : (
                    <span className="text-gray-300 text-xs flex justify-center"><FiImage className="mr-1" />-</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={statusUpdate[order.id] || order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none shadow"
                    >
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <button
                      onClick={() => handleUpdateClick(order.id)}
                      disabled={updatingId === order.id}
                      className="bg-gradient-to-r from-blue-500 to-pink-400 text-white px-3 py-1 rounded-lg hover:scale-105 transition disabled:opacity-50 flex items-center gap-1"
                      title="Update Status"
                    >
                      <FiCheckCircle />
                      {updatingId === order.id ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="flex items-center gap-1 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                    title="Hapus"
                  >
                    <FiTrash2 />
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center p-8 text-gray-400">
                  Tidak ada custom order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomOrderList;