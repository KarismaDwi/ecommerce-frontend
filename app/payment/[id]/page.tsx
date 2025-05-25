'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiCheckCircle, FiAlertCircle, FiArrowLeft, FiCreditCard, FiUser, FiMail, FiPhone, FiHome } from 'react-icons/fi';

interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
}

interface Produk {
  id_produk: number;
  name: string;
  harga: number;
  gambar: string;
}

interface CheckoutDetail {
  id: number;
  quantity: number;
  harga: number;
  produk: Produk;
}

interface CheckoutData {
  id: number;
  status: string;
  total_amount: number;
  payment_method: string;
  order_code: string;
  user?: UserData;
  items?: CheckoutDetail[];
}

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-300';
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const statusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <FiCheckCircle className="inline mr-2 text-green-500" />;
    case 'pending':
      return <FiAlertCircle className="inline mr-2 text-yellow-500" />;
    case 'failed':
      return <FiAlertCircle className="inline mr-2 text-red-500" />;
    default:
      return <FiAlertCircle className="inline mr-2 text-gray-500" />;
  }
};

const PaymentPage = () => {
  const params = useParams();
  const router = useRouter();
  const checkoutId = params.id;
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const token = localStorage.getItem('accessToken') || '';
        const res = await fetch(`http://localhost:7000/api/checkout/${checkoutId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch checkout data');

        const json = await res.json();
        setCheckout(json.data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    if (checkoutId) {
      fetchCheckout();
    }
  }, [checkoutId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-400 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-semibold">Memuat detail pembayaran...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
        <div className="text-center">
          <p className="text-red-500 text-lg font-bold">Error: {error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }
  if (!checkout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
        <div className="text-center">
          <p className="text-red-500 text-lg font-bold">Checkout data tidak ditemukan.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-28 bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 py-10 px-2">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-8 border border-pink-100">
        <div className="flex items-center mb-8">
          {/* <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full bg-gradient-to-r from-pink-100 via-yellow-100 to-blue-100 hover:scale-110 transition"
            aria-label="Back"
          >
            <FiArrowLeft className="text-xl text-pink-500" />
          </button> */}
          <h1 className="text-3xl font-extrabold text-pink-600 tracking-wide">Konfirmasi Pembayaran</h1>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-1">Order #{checkout.id}</h2>
          <div className="flex gap-2 items-center">
            <span className="font-mono text-indigo-800 text-sm bg-indigo-50 px-3 py-1 rounded-lg">
              Kode Pesanan: {checkout.order_code}
            </span>
            <span className={`ml-2 px-3 py-1 rounded-lg border text-xs ${statusColor(checkout.status)}`}>
              {statusIcon(checkout.status)}
              {checkout.status.charAt(0).toUpperCase() + checkout.status.slice(1)}
            </span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-pink-50 rounded-2xl p-4 flex items-center border border-pink-100 shadow">
            <FiCreditCard className="text-2xl text-pink-400 mr-3" />
            <div>
              <div className="text-xs text-gray-500">Metode Pembayaran</div>
              <div className="font-bold text-pink-600">{checkout.payment_method}</div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4 flex items-center border border-yellow-100 shadow">
            <FiCheckCircle className="text-2xl text-yellow-400 mr-3" />
            <div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="font-bold text-yellow-600 capitalize">{checkout.status}</div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 flex items-center border border-blue-100 shadow">
            <FiCreditCard className="text-2xl text-blue-400 mr-3" />
            <div>
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-bold text-blue-700">
                Rp {checkout.total_amount.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </section>

        {checkout.user && (
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-3 flex items-center text-pink-500">
              <FiUser className="mr-2" /> Data Pemesan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center">
                <FiUser className="mr-2 text-gray-400" />
                <span className="font-semibold">{checkout.user.username}</span>
              </div>
              <div className="flex items-center">
                <FiMail className="mr-2 text-gray-400" />
                <span>{checkout.user.email}</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="mr-2 text-gray-400" />
                <span>{checkout.user.phone}</span>
              </div>
              <div className="flex items-center">
                <FiHome className="mr-2 text-gray-400" />
                <span>{checkout.user.address}</span>
              </div>
            </div>
          </section>
        )}

        {checkout.items && checkout.items.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-blue-700">Produk Pesanan</h3>
            <div className="space-y-4">
              {checkout.items.map((detail) => (
                <div
                  key={detail.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-blue-100 shadow"
                >
                  <img
                    src={`http://localhost:7000/upload/${detail.produk.gambar}`}
                    alt={detail.produk.name}
                    className="w-20 h-20 object-cover rounded-lg shadow"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">{detail.produk.name}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm">
                      <span className="px-2 py-1 bg-blue-50 rounded text-blue-700 font-medium">
                        Harga: Rp {detail.harga.toLocaleString('id-ID')}
                      </span>
                      <span className="px-2 py-1 bg-yellow-50 rounded text-yellow-700 font-medium">
                        Qty: {detail.quantity}
                      </span>
                      <span className="px-2 py-1 bg-pink-50 rounded text-pink-500 font-medium">
                        Subtotal: Rp {(detail.harga * detail.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {checkout.payment_method.toLowerCase() === 'bank transfer' && checkout.status.toLowerCase() === 'pending' && (
          <section className="p-5 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-2xl shadow mb-8">
            <h3 className="text-yellow-800 font-bold text-lg flex items-center mb-2">
              <FiAlertCircle className="mr-2" /> Instruksi Pembayaran
            </h3>
            <p className="text-yellow-700">
              Silakan lakukan transfer ke rekening berikut:<br />
              <span className="font-bold text-yellow-900 block my-2 text-lg">123-456-789 Bank ABC</span>
              Setelah transfer, konfirmasi pembayaran melalui menu konfirmasi pembayaran.
            </p>
          </section>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition text-lg"
          >
            <FiArrowLeft />
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;