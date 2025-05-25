'use client';
import { useEffect, useState, useRef } from 'react';
import { FiSearch, FiFilter, FiEdit, FiTrash2 } from 'react-icons/fi';
import { HiOutlineDownload } from 'react-icons/hi';
import Image from 'next/image';
import html2pdf from 'html2pdf.js';
import Papa from 'papaparse';

const sizeOptions = [
  'Spray', 'Standard bloom', 'Full bloom', 'Bud', 'Mini bouquet', 'Grand bouquet'
];

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    harga: '',
    deskripsi: '',
    stok: '',
    warna: '',
    kategori: '',
    ukuran: 'Spray,Standard bloom,Full bloom,Bud,Mini bouquet,Grand bouquet'
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
  const [showExportTable, setShowExportTable] = useState(false);

  const fetchProduk = async () => {
    try {
      const res = await fetch('http://localhost:7000/api/produk');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await fetch(`http://localhost:7000/api/produk/${id}`, { method: 'DELETE' });
      fetchProduk();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (product: any) => {
    setEditId(product.id_produk);
    setFormData({
      name: product.name,
      harga: product.harga,
      deskripsi: product.deskripsi,
      stok: product.stok,
      warna: product.warna || '',
      kategori: product.kategori || '',
      ukuran: product.ukuran || 'Spray,Standard bloom,Full bloom,Bud,Mini bouquet,Grand bouquet'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (size: string) => {
    const sizes = formData.ukuran.split(',');
    const index = sizes.indexOf(size);
    if (index > -1) {
      sizes.splice(index, 1);
    } else {
      sizes.push(size);
    }
    setFormData({
      ...formData,
      ukuran: sizes.filter(Boolean).join(',')
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    if (file) data.append('file', file);
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof typeof formData]) data.append(key, formData[key as keyof typeof formData]);
    });

    try {
      const url = editId
        ? `http://localhost:7000/api/produk/${editId}`
        : 'http://localhost:7000/api/save';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: data });
      const result = await res.json();

      if (!res.ok) throw new Error(result.msg || 'Something went wrong');

      setMessage(result.msg);
      setEditId(null);
      setFormData({
        name: '',
        harga: '',
        deskripsi: '',
        stok: '',
        warna: '',
        kategori: '',
        ukuran: 'Spray,Standard bloom,Full bloom,Bud,Mini bouquet,Grand bouquet'
      });
      setFile(null);
      fetchProduk();
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.kategori?.toLowerCase().includes(q) ||
      p.warna?.toLowerCase().includes(q) ||
      p.ukuran?.toLowerCase().includes(q) ||
      p.deskripsi?.toLowerCase().includes(q)
    );
  });

  // Export PDF
  const exportPDF = async () => {
    setShowExportTable(true);
    await new Promise((r) => setTimeout(r, 150));
    if (tableRef.current) {
      const opt = {
        margin: 0.5,
        filename: 'produk.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };
      await html2pdf().from(tableRef.current).set(opt).save();
    }
    setShowExportTable(false);
  };

  // Export CSV
  const exportCSV = () => {
    if (!filteredProducts.length) return alert('Data produk kosong!');
    const csvData = filteredProducts.map(prod => ({
      Image: `http://localhost:7000/upload/${prod.gambar}`,
      Name: prod.name,
      Price: prod.harga,
      Stock: prod.stok,
      Sizes: prod.ukuran,
      Category: prod.kategori || '-',
      Color: prod.warna || '-',
    }));
    const csv = Papa.unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'produk.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 ml-64">
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Cari produk, kategori, warna, ukuran, deskripsi..."
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

        {/* Form Add/Edit */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
          <h2 className="text-xl font-bold mb-4 text-pink-700">{editId ? 'Edit Produk' : 'Tambah Produk'}</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="name" value={formData.name} placeholder="Nama Produk" onChange={handleChange} required className="rounded-xl border-2 border-pink-200 px-3 py-2"/>
            <input type="number" name="harga" min="100000" value={formData.harga} placeholder="Harga" onChange={handleChange} required className="rounded-xl border-2 border-pink-200 px-3 py-2"/>
            <textarea name="deskripsi" value={formData.deskripsi} placeholder="Deskripsi" onChange={handleChange} required className="md:col-span-3 rounded-xl border-2 border-pink-200 px-3 py-2"/>
            <input type="number" name="stok" min="1" value={formData.stok} placeholder="Stok" onChange={handleChange} required className="rounded-xl border-2 border-pink-200 px-3 py-2"/>
            <input type="text" name="warna" value={formData.warna} placeholder="Warna (opsional)" onChange={handleChange} className="rounded-xl border-2 border-pink-200 px-3 py-2"/>
            <input type="text" name="kategori" value={formData.kategori} placeholder="Kategori (opsional)" onChange={handleChange} className="rounded-xl border-2 border-pink-200 px-3 py-2"/>
            <div className="md:col-span-3 space-y-2">
              <label className="block text-sm font-medium text-pink-500">Ukuran Tersedia</label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map(size => (
                  <div key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      id={size}
                      checked={formData.ukuran.split(',').includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="mr-1 accent-pink-500"
                    />
                    <label htmlFor={size} className="text-sm">
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="md:col-span-3"/>
            <button type="submit" className="bg-gradient-to-r from-pink-500 to-pink-400 text-white py-2 px-4 rounded-xl col-span-full font-bold shadow hover:scale-105 transition">
              {editId ? 'Update Produk' : 'Upload Produk'}
            </button>
            {message && <p className="text-sm text-green-600 col-span-full">{message}</p>}
          </form>
        </div>
        
        {/* Tabel export, HIDDEN di browser kecuali saat export */}
        <div
          ref={tableRef}
          className={`bg-white rounded-xl shadow-md p-4 ${showExportTable ? '' : 'hidden'}`}
        >
          <h2 className="text-lg font-bold mb-4 text-pink-700">Daftar Produk</h2>
          <table className="w-full table-auto">
            <thead className="text-left text-pink-700 bg-pink-50 border-b">
              <tr>
                <th className="py-2">Gambar</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Ukuran</th>
                <th>Kategori</th>
                <th>Warna</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProducts.map((p) => (
                <tr key={p.id_produk} className="border-b hover:bg-gray-50">
                  <td className="py-3">
                    <img
                      src={`http://localhost:7000/upload/${p.gambar}`}
                      alt={p.name}
                      width={48}
                      height={48}
                      style={{borderRadius: 8, objectFit: 'cover'}}
                    />
                  </td>
                  <td className="py-3 font-medium">{p.name}</td>
                  <td>Rp {parseInt(p.harga).toLocaleString('id-ID')}</td>
                  <td>{p.stok} pcs</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {p.ukuran.split(',').map((size: string) => (
                        <span key={size} className="inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs font-bold">
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{p.kategori || '-'}</td>
                  <td>{p.warna || '-'}</td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    Tidak ada produk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tabel admin, selalu tampil */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
          <table className="w-full table-auto">
            <thead className="text-left text-pink-700 bg-pink-50 border-b">
              <tr>
                <th className="py-2">Gambar</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Ukuran</th>
                <th>Kategori</th>
                <th>Warna</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProducts.map((p) => (
                <tr key={p.id_produk} className="border-b hover:bg-yellow-50 transition">
                  <td className="py-3">
                    <Image
                      src={`http://localhost:7000/upload/${p.gambar}`}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="py-3 font-semibold">{p.name}</td>
                  <td className="font-bold text-pink-600">Rp {parseInt(p.harga).toLocaleString('id-ID')}</td>
                  <td>{p.stok} pcs</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {p.ukuran.split(',').map((size: string) => (
                        <span key={size} className="inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs font-bold">
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{p.kategori || '-'}</td>
                  <td>{p.warna || '-'}</td>
                  <td className="flex gap-3 text-gray-600">
                    <button onClick={() => handleEdit(p)} className="hover:text-blue-500" title="Edit">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(p.id_produk)} className="hover:text-red-500" title="Hapus">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">
                    Tidak ada produk.
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