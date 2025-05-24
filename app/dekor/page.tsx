"use client";
import { useState } from 'react';

export default function AddProduk() {
  const [formData, setFormData] = useState({
    name: '',
    harga: '',
    deskripsi: '',
    stok: '',
    ukuran: '',
    warna: '',
    kategori: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return setMessage('Please upload an image');
    }

    const data = new FormData();
    data.append('file', file); // ⬅️ Sesuai dengan backend: req.files.file
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await fetch('http://localhost:7000/api/save', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.msg || 'Something went wrong');

      setMessage(result.msg);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Tambah Produk</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Nama Produk" onChange={handleChange} required /><br />
        <input type="number" name="harga" placeholder="Harga" onChange={handleChange} required /><br />
        <textarea name="deskripsi" placeholder="Deskripsi" onChange={handleChange} required /><br />
        <input type="number" name="stok" placeholder="Stok" onChange={handleChange} required /><br />
        <input type="text" name="ukuran" placeholder="Ukuran" onChange={handleChange} required /><br />
        <input type="text" name="warna" placeholder="Warna (opsional)" onChange={handleChange} /><br />
        <input type="text" name="kategori" placeholder="Kategori (opsional)" onChange={handleChange} /><br />
        <input type="file" name="file" accept="image/*" onChange={handleFileChange} required /><br />
        <button type="submit">Upload Produk</button>
      </form>
    </div>
  );
}
