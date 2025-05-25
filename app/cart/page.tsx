'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';

interface CartItem {
  id: number;
  quantity: number;
  ukuran: string;
  produk: {
    id_produk: number;
    name: string;
    harga: number;
    gambar: string;
    ukuran: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notif, setNotif] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        const res = await fetch('http://localhost:7000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('accessToken');
            router.push('/login');
          }
          throw new Error('Failed to fetch cart');
        }

        const data = await res.json();
        setCartItems(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const showNotif = (message: string, type: 'success' | 'error' = 'success') => {
    setNotif({ show: true, message, type });
    setTimeout(() => setNotif({ ...notif, show: false }), 2500);
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:7000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) throw new Error('Failed to update quantity');
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err: any) {
      setError(err.message || 'Update failed');
      showNotif('Gagal memperbarui jumlah.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:7000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to remove item');
      setCartItems(cartItems.filter(item => item.id !== itemId));
      showNotif('Berhasil menghapus produk dari keranjang.', 'success');
    } catch (err: any) {
      setError(err.message || 'Remove failed');
      showNotif('Gagal menghapus produk.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.produk.harga * item.quantity),
      0
    );
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-peach">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-pink-400 mx-auto"></div>
          <p className="mt-4 text-lg text-pink-600 font-semibold">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-peach">
        <div className="text-center">
          <p className="text-red-500 text-lg font-bold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-peach text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-28 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Notif */}
      {notif.show && (
        <div className={`fixed z-50 top-6 right-6 flex items-center gap-2 text-lg px-5 py-3 rounded-xl shadow-xl border-2
          ${notif.type === 'success'
            ? 'bg-green-50 border-green-300 text-green-700'
            : 'bg-red-50 border-red-300 text-red-700'
          }`}>
          <FiCheckCircle className={notif.type === 'success' ? "text-green-500" : "text-red-400"} />
          <span>{notif.message}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-10">
          <FiShoppingCart className="text-3xl mr-3 text-pink-500" />
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide drop-shadow">Keranjang Belanja</h1>
          <span className="ml-auto bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-bold rounded-full px-4 py-1 shadow">
            {cartItems.length} item
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white/90 rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-500 text-lg mb-6">Keranjang kamu kosong</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-300 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
            >
              Lanjut Belanja
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white/95 rounded-2xl shadow-xl overflow-hidden">
              {cartItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-5 flex flex-col sm:flex-row gap-4 border-b last:border-b-0 transition hover:bg-pink-50/40 ${
                    idx % 2 === 1 ? 'bg-yellow-50/40' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                    <div className="w-28 h-28 relative rounded-xl shadow border border-pink-100 bg-white">
                      <Image
                        src={`http://localhost:7000/upload/${item.produk.gambar}`}
                        alt={item.produk.name}
                        fill
                        className="object-contain rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-pink-700">{item.produk.name}</h3>
                      <p className="text-gray-500 mt-1">
                        Ukuran: <span className="font-semibold">{item.ukuran}</span>
                      </p>
                      <p className="text-lg font-bold mt-2 text-yellow-700">
                        Rp {item.produk.harga.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center border-2 border-pink-100 rounded-lg shadow bg-pink-50/80">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-2 rounded-l-lg bg-white hover:bg-pink-100 transition disabled:opacity-50"
                        >
                          <FiMinus className="text-lg" />
                        </button>
                        <span className="px-4 py-2 text-lg font-semibold bg-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 rounded-r-lg bg-white hover:bg-pink-100 transition"
                        >
                          <FiPlus className="text-lg" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 flex items-center font-semibold transition"
                      >
                        <FiTrash2 className="mr-2" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white/95 rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-gray-700">Ringkasan Pesanan</h2>
                <p className="text-2xl font-bold text-pink-600">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </p>
              </div>

              <button
                onClick={proceedToCheckout}
                disabled={cartItems.length === 0}
                className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-pink-500 to-yellow-300 text-white text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition disabled:opacity-50"
              >
                <span>Pesan Sekarang</span>
                <FiChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}