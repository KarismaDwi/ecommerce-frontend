'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiCalendar,
  FiGift,
  FiMessageCircle,
  FiChevronLeft,
  FiInfo,
  FiCreditCard,
} from 'react-icons/fi';

interface CustomOrder {
  id: number;
  userId: number;
  username: string;
  phone: string;
  email: string;
  address: string;
  deliveryDate: string;
  flowerType: string;
  flowerColor: string;
  size: string;
  arrangement: string;
  theme: string | null;
  messageCard: string | null;
  paymentMethod: string;
  notes: string | null;
  imagePath: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const statusMap = {
  completed: {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <FiCheckCircle className="inline mr-1 text-green-500" />,
    text: 'Selesai',
  },
  cancelled: {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <FiXCircle className="inline mr-1 text-red-500" />,
    text: 'Dibatalkan',
  },
  processing: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <FiLoader className="inline mr-1 animate-spin text-blue-500" />,
    text: 'Diproses',
  },
  pending: {
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: <FiInfo className="inline mr-1 text-yellow-500" />,
    text: 'Menunggu',
  },
};

const CustomOrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const [order, setOrder] = useState<CustomOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('accessToken') || '';
        const res = await fetch(`http://localhost:7000/api/custom-order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch custom order data');
        const data = await res.json();
        const orderData = data.data || data.order || data;
        setOrder(orderData);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
      <div className="animate-spin h-14 w-14 rounded-full border-t-4 border-b-4 border-pink-400 mb-4"></div>
      <span className="text-lg text-pink-700 font-semibold">Memuat detail pesanan...</span>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
      <span className="text-xl text-red-600 font-bold mb-4">Error: {error}</span>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
      <span className="text-xl text-red-600 font-bold mb-4">Data pesanan tidak ditemukan.</span>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
      >
        Kembali ke Beranda
      </button>
    </div>
  );

  const status = statusMap[order.status];

  return (
    <div className="mt-24 min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 py-10 px-2">
      <div className="max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-8 border border-pink-100">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full bg-gradient-to-r from-pink-100 via-yellow-100 to-blue-100 hover:scale-110 transition"
            aria-label="Back"
          >
            <FiChevronLeft className="text-xl text-pink-500" />
          </button>
          <h1 className="text-3xl font-extrabold text-pink-600 tracking-wide">Detail Custom Order</h1>
        </div>

        <section className="mb-7">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="font-mono text-indigo-800 text-sm bg-indigo-50 px-4 py-1 rounded-lg">
              ID Order: #{order.id}
            </span>
            <span className={`flex items-center px-4 py-1 rounded-lg border text-xs font-semibold ${status?.color || ''}`}>
              {status?.icon}
              {status?.text || order.status}
            </span>
            <span className="ml-auto text-xs text-gray-400">Dibuat: {formatDate(order.createdAt)}</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">
          <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100 shadow flex items-center gap-2">
            <FiCreditCard className="text-lg text-pink-400" />
            <div>
              <div className="text-xs text-gray-500">Metode Bayar</div>
              <div className="font-bold text-pink-600">{order.paymentMethod}</div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100 shadow flex items-center gap-2">
            <FiCalendar className="text-lg text-yellow-400" />
            <div>
              <div className="text-xs text-gray-500">Tgl Pengiriman</div>
              <div className="font-bold text-yellow-700">{formatDate(order.deliveryDate)}</div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 shadow flex items-center gap-2">
            <FiGift className="text-lg text-blue-400" />
            <div>
              <div className="text-xs text-gray-500">Tipe Bunga</div>
              <div className="font-bold text-blue-700">{order.flowerType}</div>
            </div>
          </div>
        </section>

        {/* Customer Details */}
        <section className="mb-7">
          <h3 className="text-lg font-bold mb-3 flex items-center text-pink-500">
            <FiUser className="mr-2" /> Data Pemesan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex items-center">
              <FiUser className="mr-2 text-gray-400" />
              <span className="font-semibold">{order.username}</span>
            </div>
            <div className="flex items-center">
              <FiMail className="mr-2 text-gray-400" />
              <span>{order.email}</span>
            </div>
            <div className="flex items-center">
              <FiPhone className="mr-2 text-gray-400" />
              <span>{order.phone}</span>
            </div>
            <div className="flex items-center">
              <FiHome className="mr-2 text-gray-400" />
              <span>{order.address}</span>
            </div>
          </div>
        </section>

        {/* Order Specifications */}
        <section className="mb-7">
          <h3 className="text-lg font-bold mb-3 text-blue-700 flex items-center"><FiGift className="mr-2" /> Spesifikasi Pesanan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Jenis Bunga:</span> {order.flowerType}</p>
              <p><span className="font-medium">Warna Bunga:</span> {order.flowerColor}</p>
              <p><span className="font-medium">Ukuran:</span> {order.size}</p>
              <p><span className="font-medium">Rangkaian:</span> {order.arrangement}</p>
            </div>
            <div>
              {order.theme && <p><span className="font-medium">Tema:</span> {order.theme}</p>}
              {order.messageCard && (
                <p>
                  <span className="font-medium">Kartu Ucapan:</span> {order.messageCard}
                </p>
              )}
              {order.notes && (
                <div className="mt-2">
                  <p className="font-medium">Catatan Tambahan:</p>
                  <p className="bg-gray-50 p-3 rounded">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reference Image */}
        {order.imagePath && (
          <section className="mb-7">
            <h3 className="text-lg font-bold mb-2 flex items-center text-yellow-600">
              <FiMessageCircle className="mr-2" /> Gambar Referensi
            </h3>
            <img
              src={`http://localhost:7000${order.imagePath}`}
              alt="Custom order reference"
              className="w-32 h-32 object-cover rounded-xl border border-yellow-100 shadow"
            />
          </section>
        )}

        {/* Payment Instructions */}
        {order.paymentMethod.toLowerCase() === 'bank transfer' && order.status === 'pending' && (
          <section className="p-5 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-2xl shadow mb-8">
            <h3 className="text-yellow-800 font-bold text-lg flex items-center mb-2">
              <FiInfo className="mr-2" /> Instruksi Pembayaran
            </h3>
            <p className="text-yellow-700">
              Silakan transfer ke rekening:
              <span className="font-bold text-yellow-900 block my-2 text-lg">123-456-789 Bank ABC</span>
              Setelah transfer, lakukan konfirmasi melalui menu konfirmasi pembayaran.
            </p>
          </section>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition text-lg"
          >
            <FiChevronLeft />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderPage;