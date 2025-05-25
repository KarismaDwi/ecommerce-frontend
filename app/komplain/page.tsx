'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const UserKomplainPage = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Komplain membutuhkan autentikasi user, sehingga perlu token Authorization
  const token = (typeof window !== "undefined") ? localStorage.getItem('accessToken') : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Kirim subject dan message, sertakan Authorization header (wajib sesuai backend)
      await axios.post(
        'http://localhost:7000/api/komplain',
        { subject, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push('/');
    } catch (err) {
      // Ambil pesan error dari response backend jika ada
      const msg = err?.response?.data?.error || 'Gagal mengirim komplain';
      setError(msg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-8 text-blue-800">Buat Komplain</h2>
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded shadow p-6">
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Judul Komplain</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="Judul/Subject komplain"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Isi Komplain</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            className="w-full border rounded p-2"
            rows={4}
            placeholder="Tulis detail komplain di sini"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kirim Komplain
        </button>
      </form>
    </div>
  );
};

export default UserKomplainPage;