'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FiDollarSign, FiTruck, FiFileText, FiCheckCircle, FiAlertCircle, FiXCircle, FiLoader, FiDownload, FiFilter } from 'react-icons/fi';
import html2pdf from 'html2pdf.js';
import Papa from 'papaparse';

interface CheckoutEntry {
  id: number;
  order_code: string;
  createdAt: string;
  shipping_cost: number;
  total_amount: number;
  proof_of_transfer?: string;
  status: string;
  payment_method: string;
}

export default function LaporanKeuanganPage() {
  const [data, setData] = useState<CheckoutEntry[]>([]);
  const [filteredData, setFilteredData] = useState<CheckoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalShipping, setTotalShipping] = useState(0);
  const [showExportTable, setShowExportTable] = useState(false);
  const [monthFilter, setMonthFilter] = useState<string>(getCurrentMonth());

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:7000/api/checkouts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data');
        }

        const result = await response.json();
        const checkouts = Array.isArray(result.data) ? result.data : [];

        setData(checkouts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data per bulan setiap monthFilter berubah atau data berubah
  useEffect(() => {
    const filtered = data.filter(item =>
      item.createdAt && item.createdAt.startsWith(monthFilter)
    );
    setFilteredData(filtered);
    setTotalRevenue(filtered.reduce((sum, item) => sum + (item.total_amount || 0), 0));
    setTotalShipping(filtered.reduce((sum, item) => sum + (item.shipping_cost || 0), 0));
  }, [data, monthFilter]);

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  function formatRupiah(x: number) {
    return 'Rp ' + (x || 0).toLocaleString('id-ID');
  }

  function formatDate(dateString: string) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200 font-semibold">
            <FiCheckCircle className="text-green-500" /> Selesai
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
            <FiLoader className="animate-spin text-blue-500" /> Diproses
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 border border-red-200 font-semibold">
            <FiXCircle className="text-red-500" /> Dibatalkan
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 font-semibold">
            <FiAlertCircle className="text-yellow-500" /> {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  }

  // Export PDF
  const exportPDF = async () => {
    setShowExportTable(true);
    await new Promise((r) => setTimeout(r, 120));
    if (tableRef.current) {
      const opt = {
        margin: 0.5,
        filename: `laporan-keuangan-${monthFilter}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      };
      await html2pdf().from(tableRef.current).set(opt).save();
    }
    setShowExportTable(false);
  };

  // Export CSV
  const exportCSV = () => {
    if (!filteredData.length) return alert('Data kosong!');
    const csvData = filteredData.map((item, idx) => ({
      No: idx + 1,
      KodeOrder: item.order_code,
      Tanggal: formatDate(item.createdAt),
      Ongkir: item.shipping_cost,
      TotalPembayaran: item.total_amount,
      MetodePembayaran: item.payment_method,
      Status: item.status,
      Bukti: item.proof_of_transfer || '-',
    }));
    const csv = Papa.unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan-keuangan-${monthFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate list of available months from the data for filter dropdown
  const availableMonths = Array.from(
    new Set(data.map(item => item.createdAt?.slice(0, 7)))
  ).filter(Boolean);

  return (
    <div className="w-full">
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
    <div className="max-w-6xl mx-auto ml-72 py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-pink-700 tracking-wide flex justify-center items-center gap-3">
        <FiFileText className="text-pink-400" /> Laporan Keuangan (Checkout)
      </h1>

      {/* Filter Bulan */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FiFilter className="text-pink-600 text-lg" />
          <label htmlFor="monthFilter" className="font-semibold text-gray-700">Filter Bulan:</label>
          <select
            id="monthFilter"
            className="border rounded-lg px-3 py-2 ml-2"
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
          >
            {availableMonths.length === 0 && (
              <option value={monthFilter}>{monthFilter}</option>
            )}
            {availableMonths.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        {/* Tombol Export */}
        <div className="flex justify-end gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-blue-300 text-white px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
          >
            <FiDownload />
            Export PDF
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-300 text-white px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
          >
            <FiDownload />
            Export CSV
          </button>
        </div>
      </div>

      {/* Export PDF table (hidden) */}
      {showExportTable && (
        <div ref={tableRef} className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-pink-700">Laporan Keuangan Bulan {monthFilter}</h2>
          <table className="w-full table-auto border rounded-2xl">
            <thead className="bg-pink-100 text-pink-700">
              <tr>
                <th className="py-3 px-4 text-left">No</th>
                <th className="py-3 px-4 text-left">Kode Order</th>
                <th className="py-3 px-4 text-left">Tanggal</th>
                <th className="py-3 px-4 text-right">Ongkir</th>
                <th className="py-3 px-4 text-right">Total Pembayaran</th>
                <th className="py-3 px-4 text-left">Metode Pembayaran</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{item.order_code}</td>
                  <td className="py-3 px-4">{formatDate(item.createdAt)}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-600">{formatRupiah(item.shipping_cost)}</td>
                  <td className="py-3 px-4 text-right font-bold text-yellow-700">{formatRupiah(item.total_amount)}</td>
                  <td className="py-3 px-4 capitalize font-semibold">{item.payment_method}</td>
                  <td className="py-3 px-4">{item.status}</td>
                  <td className="py-3 px-4 text-center">
                    {item.proof_of_transfer ? "Ada" : "-"}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    Tidak ada data transaksi bulan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-4 border-b-4 border-pink-200">
          <div className="p-3 bg-pink-50 rounded-full">
            <FiFileText className="text-2xl text-pink-500" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs font-semibold uppercase">Total Transaksi</h3>
            <p className="text-3xl font-extrabold text-pink-700">{filteredData.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-4 border-b-4 border-yellow-200">
          <div className="p-3 bg-yellow-50 rounded-full">
            <FiDollarSign className="text-2xl text-yellow-500" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs font-semibold uppercase">Total Pendapatan</h3>
            <p className="text-3xl font-extrabold text-yellow-600">{formatRupiah(totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-4 border-b-4 border-blue-200">
          <div className="p-3 bg-blue-50 rounded-full">
            <FiTruck className="text-2xl text-blue-500" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs font-semibold uppercase">Total Biaya Pengiriman</h3>
            <p className="text-3xl font-extrabold text-blue-600">{formatRupiah(totalShipping)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-400 py-24">
          <FiLoader className="animate-spin text-4xl mb-4" />
          Memuat data...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center text-red-500 py-24">
          <FiAlertCircle className="text-4xl mb-4" />
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-xl bg-white">
          <table className="w-full table-auto border rounded-2xl">
            <thead className="bg-pink-100 text-pink-700">
              <tr>
                <th className="py-3 px-4 text-left">No</th>
                <th className="py-3 px-4 text-left">Kode Order</th>
                <th className="py-3 px-4 text-left">Tanggal</th>
                <th className="py-3 px-4 text-right">Ongkir</th>
                <th className="py-3 px-4 text-right">Total Pembayaran</th>
                <th className="py-3 px-4 text-left">Metode Pembayaran</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-pink-50 transition">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{item.order_code}</td>
                  <td className="py-3 px-4">{formatDate(item.createdAt)}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-600">{formatRupiah(item.shipping_cost)}</td>
                  <td className="py-3 px-4 text-right font-bold text-yellow-700">{formatRupiah(item.total_amount)}</td>
                  <td className="py-3 px-4 capitalize font-semibold">{item.payment_method}</td>
                  <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3 px-4 text-center">
                    {item.proof_of_transfer ? (
                      <a 
                        href={item.proof_of_transfer} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Lihat
                      </a>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    Tidak ada data transaksi bulan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}