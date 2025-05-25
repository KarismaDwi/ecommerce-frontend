'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import Papa from 'papaparse';
import { FiSearch, FiDownload, FiAlertCircle } from 'react-icons/fi';

const AdminKomplainList = () => {
  const [komplains, setKomplains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportTable, setShowExportTable] = useState(false);

  const tableRef = useRef(null);
  const token = (typeof window !== 'undefined') ? localStorage.getItem('accessToken') : '';

  // Fetch data komplain
  const fetchKomplains = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:7000/api/komplain', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKomplains(res.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Gagal mengambil data komplain');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKomplains();
    // eslint-disable-next-line
  }, []);

  // Filter data berdasarkan subject dan message
  const filteredKomplains = komplains.filter((k) => {
    const q = searchQuery.toLowerCase();
    return (
      (k.subject || '').toLowerCase().includes(q) ||
      (k.message || '').toLowerCase().includes(q)
    );
  });

  // Export PDF
  const exportPDF = async () => {
    if (filteredKomplains.length === 0) {
      alert('Data komplain kosong!');
      return;
    }
    setShowExportTable(true);

    // Beri waktu render tabel agar terlihat oleh html2pdf
    await new Promise((r) => setTimeout(r, 300));

    if (tableRef.current) {
      const opt = {
        margin: 0.5,
        filename: 'komplains.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      };
      try {
        await html2pdf().from(tableRef.current).set(opt).save();
      } catch (err) {
        alert('Gagal mengekspor PDF');
      }
    }
    setShowExportTable(false);
  };

  // Export CSV
  const exportCSV = () => {
    if (filteredKomplains.length === 0) {
      alert('Data komplain kosong!');
      return;
    }
    const csvData = filteredKomplains.map((k) => ({
      ID: k.id,
      Subject: k.subject,
      Message: k.message,
      'Tanggal Dikirim': new Date(k.created_at).toLocaleString('id-ID'),
    }));

    // delimiter default koma, lebih kompatibel
    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'komplains.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 rounded-2xl shadow mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-400 mb-4"></div>
        <span className="text-pink-600 font-bold">Memuat data komplain...</span>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-red-500">{error}</span>
      </div>
    );

  return (
    <div className="max-w-5xl ml-64 mx-auto px-4 py-10 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 rounded-3xl shadow-xl mt-10">
      <h2 className="text-3xl font-extrabold mb-8 text-pink-700 tracking-wide flex items-center gap-3">
        <FiAlertCircle className="text-2xl" />
        Admin - Daftar Komplain
      </h2>

      {/* Search dan tombol export */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center w-full md:w-1/3 bg-white rounded-lg border-2 border-pink-100 shadow px-3 py-2 gap-2">
          <FiSearch className="text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Cari berdasarkan subject atau pesan komplain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Tabel export untuk PDF, hidden dari tampilan utama */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          zIndex: -1,
          width: '100%',
        }}
      >
        {showExportTable && (
          <div ref={tableRef}>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border font-semibold">ID</th>
                  <th className="p-2 border font-semibold">Subject</th>
                  <th className="p-2 border font-semibold">Pesan</th>
                  <th className="p-2 border font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {filteredKomplains.map((k) => (
                  <tr key={k.id}>
                    <td className="p-2 border">{k.id}</td>
                    <td className="p-2 border">{k.subject}</td>
                    <td className="p-2 border">{k.message}</td>
                    <td className="p-2 border">{new Date(k.created_at).toLocaleString('id-ID')}</td>
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
              <th className="p-3 font-semibold text-pink-700">Subjek</th>
              <th className="p-3 font-semibold text-pink-700">Pesan</th>
              <th className="p-3 font-semibold text-pink-700">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filteredKomplains.map((k) => (
              <tr key={k.id} className="border-b hover:bg-yellow-50 transition">
                <td className="p-3">{k.subject}</td>
                <td className="p-3">{k.message}</td>
                <td className="p-3">{new Date(k.created_at).toLocaleString('id-ID')}</td>
              </tr>
            ))}
            {filteredKomplains.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-8 text-gray-400">
                  Tidak ada komplain.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminKomplainList;