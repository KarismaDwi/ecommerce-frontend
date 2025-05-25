'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaRegImage } from 'react-icons/fa';

export default function CustomOrderForm() {
  const router = useRouter();
  const [minDeliveryDate, setMinDeliveryDate] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    address: '',
    deliveryDate: '',
    flowerType: '',
    flowerColor: '',
    size: '',
    arrangement: '',
    theme: '',
    messageCard: '',
    paymentMethod: '',
    notes: '',
    image: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:7000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 200) {
          const { username, phone, email, address } = res.data.data || res.data;
          setFormData(prev => ({
            ...prev,
            username: username || '',
            phone: phone || '',
            email: email || '',
            address: address || '',
          }));
        }
      } catch {
        // Gagal fetch user, biarkan field manual
      }
    };

    // Set tanggal minimal pengiriman
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}T${hour}:${minute}`;
    setMinDeliveryDate(formatted);
    setFormData(prev => ({ ...prev, deliveryDate: formatted }));

    fetchUser();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const input = e.target as HTMLInputElement;
    if (type === 'file') {
      const file = input.files?.[0] || null;
      setFormData(prev => ({ ...prev, [name]: file }));
      if (file) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const deliveryTime = new Date(formData.deliveryDate);
    const lastTime = new Date(formData.deliveryDate);
    lastTime.setHours(20, 0, 0, 0);

    if (deliveryTime < now) {
      showNotification('Waktu pengiriman harus setelah waktu sekarang.', 'error');
      setIsSubmitting(false);
      return;
    }

    if (deliveryTime > lastTime) {
      showNotification('Waktu pengiriman maksimal jam 8 malam.', 'error');
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      showNotification('Anda harus login terlebih dahulu.', 'error');
      router.push('/login');
      return;
    }

    try {
      const formToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formToSend.append(key, value as any);
        }
      });

      const res = await axios.post('http://localhost:7000/api/custom-order', formToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200 || res.status === 201) {
        const orderId = res.data?.order?.id;
        if (orderId) {
          router.push(`/customs/${orderId}`);
        } else {
          showNotification('Pesanan berhasil dikirim, tapi ID pesanan tidak ditemukan.', 'success');
          setTimeout(() => router.push('/customs'), 1200);
        }
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        showNotification('Sesi habis. Silakan login ulang.', 'error');
        router.push('/login');
      } else {
        showNotification(
          err.response?.data?.message || 'Terjadi kesalahan saat mengirim pesanan',
          'error'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 p-5">
      <div className="mt-36 w-full max-w-3xl mx-auto p-8 bg-white/90 shadow-2xl rounded-3xl relative border-t-8 border-pink-200">
        {/* Notifikasi */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-lg shadow-lg text-lg font-semibold
            ${notification.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
            {notification.type === 'success' ? <FaCheckCircle className="text-green-600 text-xl" /> : <FaTimesCircle className="text-red-600 text-xl" />}
            {notification.message}
          </div>
        )}

        <h2 className="text-3xl font-extrabold text-center mb-8 text-pink-700 tracking-wide drop-shadow">Form Custom Order Bunga</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama dan Telepon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold block mb-1">Nama</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                required
                placeholder="Nama lengkap"
                className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">No. Telepon</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                required
                placeholder="08xxxxxxxxxx"
                className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
              />
            </div>
          </div>

          {/* Email dan Alamat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold block mb-1">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                placeholder="contoh@email.com"
                className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Alamat</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Alamat pengiriman"
                className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
                rows={2}
              />
            </div>
          </div>

          {/* Tanggal pengiriman */}
          <div>
            <label className="font-semibold block mb-1">Tanggal & Waktu Pengiriman</label>
            <input
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              type="datetime-local"
              min={minDeliveryDate}
              required
              className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
            />
            <span className="text-xs text-gray-500 mt-1 block">*Pengiriman maksimal jam 20.00 WIB</span>
          </div>

          {/* Jenis bunga (input bebas) dan warna */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold block mb-1">Jenis Bunga</label>
              <input
                name="flowerType"
                value={formData.flowerType}
                onChange={handleChange}
                type="text"
                required
                placeholder="Contoh: Mawar, Lily, Tulip, dll"
                className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Warna</label>
              <input
                name="flowerColor"
                value={formData.flowerColor}
                onChange={handleChange}
                type="text"
                required
                placeholder="Merah, Putih, dsb"
                className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
              />
            </div>
          </div>

          {/* Ukuran dan Rangkaian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold block mb-1">Ukuran</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
              >
                <option value="">Pilih ukuran</option>
                <option value="Bud">Bud</option>
                <option value="Spray">Spray</option>
                <option value="Standard bloom">Standard bloom</option>
                <option value="Full bloom">Full bloom</option>
                <option value="Mini bouquet">Mini bouquet</option>
                <option value="Grand bouquet">Grand bouquet</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Jenis Rangkaian</label>
              <select
                name="arrangement"
                value={formData.arrangement}
                onChange={handleChange}
                required
                className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
              >
                <option value="">Pilih rangkaian</option>
                <option value="buket">Bouquet</option>
                <option value="flower box">Dekorasi Pernikahan</option>
                <option value="papan ucapan">Papan Ucapan</option>
                <option value="valentine">Valentine</option>
              </select>
            </div>
          </div>

          {/* Tema dan kartu ucapan */}
          <div>
            <label className="font-semibold block mb-1">Tema / Nuansa</label>
            <input
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              type="text"
              placeholder="Romantis, Ulang Tahun, dlsb"
              className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Isi Kartu Ucapan (Opsional)</label>
            <textarea
              name="messageCard"
              value={formData.messageCard}
              onChange={handleChange}
              placeholder="Tulis pesan Anda..."
              className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
              rows={2}
            />
          </div>

          {/* Catatan dan Gambar */}
          <div>
            <label className="font-semibold block mb-1">Catatan Tambahan (Opsional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border-2 border-pink-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
              rows={2}
            />
          </div>

          {/* Upload Gambar Referensi */}
          <div>
            <label className="font-semibold block mb-1">Upload Gambar Referensi (Opsional)</label>
            <div className="flex items-center gap-4">
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full"
              />
              {preview && (
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-pink-200 relative">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove preview"
                    className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1 shadow"
                    onClick={() => {
                      setPreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              {!preview && (
                <div className="w-14 h-14 flex items-center justify-center bg-pink-50 text-pink-300 rounded-xl border border-pink-100">
                  <FaRegImage className="text-2xl" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8 gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gradient-to-r from-red-200 via-yellow-100 to-pink-200 text-pink-700 font-semibold rounded-xl shadow hover:bg-red-400 hover:text-white transition"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-tomat to-pink-400 hover:from-pink-400 hover:to-tomat text-white px-8 py-2 rounded-xl font-bold shadow-lg tracking-wide transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pesanan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}