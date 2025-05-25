'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductDetails {
  id_produk: number;
  name: string;
  harga: number;
  gambar: string;
  ukuran?: string;
}

interface CartItem {
  id: number;
  quantity: number;
  ukuran: string;
  produk: ProductDetails;
}

interface UserData {
  id: number | string;
  username: string;
  address: string;
  phone: string;
  email: string;
}

interface CheckoutProps {
  buyNowProduct?: ProductDetails;
  buyNowQuantity?: number;
  buyNowUkuran?: string;
}

const Checkout = ({ buyNowProduct, buyNowQuantity = 1, buyNowUkuran = '' }: CheckoutProps) => {
  const router = useRouter();

  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserData>({ id: '', username: '', address: '', phone: '', email: '' });

  const [shippingMethod, setShippingMethod] = useState('Delivery to Home');
  const [shippingCost, setShippingCost] = useState(50000);

  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [payerName, setPayerName] = useState('');
  const [proofOfTransfer, setProofOfTransfer] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (buyNowProduct) {
      setBuyNowItem({
        id: 0,
        quantity: buyNowQuantity,
        ukuran: buyNowUkuran,
        produk: buyNowProduct,
      });
    }
  }, [buyNowProduct, buyNowQuantity, buyNowUkuran]);

  useEffect(() => {
    if (buyNowProduct) return;
    const fetchCart = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:7000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal ambil data troli');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCartItems(data);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        setError('Gagal mengambil data troli');
      }
    };
    fetchCart();
  }, [buyNowProduct, router]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    fetch('http://localhost:7000/api/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data user');
        return res.json();
      })
      .then(data => {
        const userData = data.data || data;
        setUser(userData);
        setReceiverName(userData.username || '');
        setPhone(userData.phone || '');
        setAddress(userData.address || '');
        setPayerName(userData.username || '');
      })
      .catch(() => setError('Gagal mengambil data user'));
  }, []);

  const itemsToCheckout = buyNowItem ? [buyNowItem] : cartItems;

  const calculateTotal = () => {
    return (
      itemsToCheckout.reduce(
        (total, item) => total + (item.produk.harga * item.quantity),
        0
      ) + shippingCost
    );
  };

  const handleConfirmOrder = async () => {
    setError('');
    setIsLoading(true);

    if (itemsToCheckout.length === 0) {
      setError('Tidak ada produk untuk checkout');
      setIsLoading(false);
      return;
    }
    if (!paymentMethod) {
      setError('Pilih metode pembayaran terlebih dahulu');
      setIsLoading(false);
      return;
    }
    if (!receiverName || !phone || !address || !deliveryDate || !deliveryTime) {
      setError('Lengkapi semua data pengiriman');
      setIsLoading(false);
      return;
    }
    if (paymentMethod === 'Bank Transfer' && !proofOfTransfer) {
      setError('Upload bukti transfer diperlukan');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      for (const item of itemsToCheckout) {
        const formData = new FormData();
        formData.append('id_produk', item.produk.id_produk.toString());
        formData.append('quantity', item.quantity.toString());
        formData.append('size', item.ukuran || '');
        formData.append('receiver_name', receiverName);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('delivery_date', deliveryDate);
        formData.append('delivery_time', deliveryTime);
        formData.append('shipping_method', shippingMethod);
        formData.append('shipping_cost', shippingCost.toString());
        formData.append('payment_method', paymentMethod);
        formData.append('total_amount', (item.produk.harga * item.quantity + shippingCost).toString());
        formData.append('payer_name', paymentMethod === 'Cash On Delivery' ? receiverName : payerName);

        if (paymentMethod === 'Bank Transfer' && proofOfTransfer) {
          formData.append('proof_of_transfer', proofOfTransfer);
        }

        const response = await fetch('http://localhost:7000/api/checkout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal memproses pesanan');
        }

        if (item === itemsToCheckout[0] && result.data?.id) {
          router.push(`/payment/${result.data.id}`);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  const handleCancelCheckout = () => {
    let id_produk: number | string | undefined;

    if (buyNowProduct) {
      id_produk = buyNowProduct.id_produk;
    } else if (cartItems.length > 0 && cartItems[0]?.produk?.id_produk) {
      id_produk = cartItems[0].produk.id_produk;
    }

    if (!id_produk) {
      setReceiverName(user.username || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setDeliveryDate('');
      setDeliveryTime('');
      setPaymentMethod('');
      setPayerName(user.username || '');
      setProofOfTransfer(null);
      setError('');
      return;
    }

    if (window.confirm('Apakah anda yakin ingin membatalkan checkout?')) {
      setReceiverName(user.username || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setDeliveryDate('');
      setDeliveryTime('');
      setPaymentMethod('');
      setPayerName(user.username || '');
      setProofOfTransfer(null);
      setError('');
      router.push(`/description/${id_produk}`);
    }
  };

  if (itemsToCheckout.length === 0)
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-3xl font-extrabold mb-4 text-pink-600 tracking-wide">Checkout</h1>
        <p className="text-gray-600">Tidak ada produk untuk dibeli.</p>
        <button
          className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-lg font-semibold shadow hover:scale-105 transition"
          onClick={() => router.push('/')}
        >
          Kembali ke Beranda
        </button>
      </div>
    );

   return (
    <div className="min-h-screen bg-gradient-to-br mt-28 from-pink-50 via-yellow-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left/Main Section */}
        <div className="md:col-span-2">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8 mb-8 border border-pink-100">
            <h1 className="text-3xl font-extrabold mb-6 text-pink-600 tracking-wide text-center">Checkout</h1>
            {/* Product List */}
            {itemsToCheckout.map(item => (
              <div key={item.id} className="mb-8 p-5 border rounded-xl bg-pink-50/80 shadow flex flex-col md:flex-row gap-4">
                <div className="w-28 h-28 relative flex-shrink-0 border rounded-xl shadow bg-white">
                  <Image
                    src={`http://localhost:7000/upload/${item.produk.gambar}`}
                    alt={item.produk.name}
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 items-center text-sm md:text-base">
                  <span className="font-semibold text-gray-600">Nama Produk:</span>
                  <span className="font-bold text-blue-900">{item.produk.name}</span>
                  <span className="font-semibold text-gray-600">Harga:</span>
                  <span className="text-pink-500 font-bold">Rp{item.produk.harga.toLocaleString()}</span>
                  <span className="font-semibold text-gray-600">Jumlah:</span>
                  <span>{item.quantity}</span>
                  <span className="font-semibold text-gray-600">Ukuran:</span>
                  <span>{item.ukuran}</span>
                  <span className="font-semibold text-gray-600">Subtotal:</span>
                  <span className="text-yellow-600 font-bold">Rp{(item.produk.harga * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}

            {/* Shipping and Payment Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleConfirmOrder();
              }}
              className="bg-white/80 rounded-2xl shadow p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-yellow-600">Data Pengiriman</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Metode Pengiriman</label>
                  <select
                    value={shippingMethod}
                    onChange={e => {
                      setShippingMethod(e.target.value);
                      setShippingCost(e.target.value === 'Pickup at Store' ? 0 : 50000);
                    }}
                    className="w-full border-2 border-pink-100 rounded-lg px-3 py-2 bg-pink-50 focus:ring-2 focus:ring-pink-300 transition"
                  >
                    <option>Delivery to Home</option>
                    <option>Pickup at Store</option>
                  </select>
                  <p className="text-sm mt-2 text-pink-500 font-semibold">
                    Ongkir: Rp{shippingCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Tanggal Pengiriman</label>
                  <input
                    type="date"
                    min={today}
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full border-2 border-pink-100 rounded-lg px-3 py-2 bg-pink-50 focus:ring-2 focus:ring-pink-300 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Nama Penerima</label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={e => setReceiverName(e.target.value)}
                    className="w-full border-2 border-pink-100 rounded-lg px-3 py-2 bg-pink-50 focus:ring-2 focus:ring-pink-300 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Nomor HP</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border-2 border-pink-100 rounded-lg px-3 py-2 bg-pink-50 focus:ring-2 focus:ring-pink-300 transition"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">Alamat Pengiriman</label>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full border-2 border-pink-100 rounded-lg px-3 py-2 bg-pink-50 focus:ring-2 focus:ring-pink-300 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Jam Pengiriman</label>
                  <select
                    value={deliveryTime}
                    onChange={e => setDeliveryTime(e.target.value)}
                    className="w-full border-2 border-pink-100 rounded-lg px-3 py-2 bg-pink-50 focus:ring-2 focus:ring-pink-300 transition"
                    required
                  >
                    <option value="">-- Pilih Jam --</option>
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-700">Data Pembayaran</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Metode Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full border-2 border-blue-100 rounded-lg px-3 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                    required
                  >
                    <option value="">-- Pilih Metode Pembayaran --</option>
                    <option value="Cash On Delivery">Cash On Delivery</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                {paymentMethod === 'Bank Transfer' && (
                  <>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Nama Pengirim Transfer</label>
                      <input
                        type="text"
                        value={payerName}
                        onChange={e => setPayerName(e.target.value)}
                        className="w-full border-2 border-blue-100 rounded-lg px-3 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 font-medium text-gray-700">Upload Bukti Transfer</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setProofOfTransfer(e.target.files ? e.target.files[0] : null)}
                        className="w-full border-2 border-blue-100 rounded-lg px-3 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              {error && <p className="text-red-600 font-semibold mt-4 mb-2">{error}</p>}

              {/* Removed action buttons from here */}
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1 bg-white/90 p-8 rounded-3xl shadow-2xl border border-yellow-100 h-max sticky top-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-yellow-600 text-center">Ringkasan Pesanan</h2>
            <div className="space-y-3">
              {itemsToCheckout.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-yellow-50 rounded-lg p-3 shadow">
                  <span className="font-medium">{item.produk.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
                  <span className="font-bold text-yellow-800">Rp{(item.produk.harga * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <hr className="my-4 border-yellow-200" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total (incl. Ongkir):</span>
                <span className="text-pink-600">Rp{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action buttons moved below total */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white shadow-lg text-lg font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : 'Konfirmasi Pesanan'}
            </button>
            <button
              type="button"
              onClick={handleCancelCheckout}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 shadow py-3 rounded-xl font-semibold text-lg transition-all duration-200"
            >
              Batalkan Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;