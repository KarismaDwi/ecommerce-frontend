'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiEdit, FiLogOut, FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiShoppingCart, FiKey,
} from 'react-icons/fi';

type User = {
  id?: number;
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  role?: string;
};

type OrderItem = {
  produk: {
    name: string;
    harga: number;
    gambar?: string;
  };
  quantity: number;
  ukuran: string;
};

type Order = {
  id: number;
  order_code: string;
  createdAt: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
};

type CustomOrder = {
  id: number;
  createdAt: string;
  status: string;
  flowerType: string;
  flowerColor: string;
  size: string;
  arrangement: string;
  deliveryDate: string;
  imagePath?: string;
  notes?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<User>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loadingCustomOrders, setLoadingCustomOrders] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.replace('/login');
        return;
      }
      try {
        setLoading(true);
        const res = await fetch('http://localhost:7000/api/profile', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('accessToken');
            router.replace('/login');
          }
          throw new Error('Gagal mengambil data profil');
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Gagal mengambil profil');
        setUser(data.data);
        setForm({
          username: data.data.username || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
          password: data.data.password || '',
        });
      } catch (err: any) {
        setMessage({ text: err.message || 'Gagal memuat profil', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setOrders([]);
        return;
      }
      setLoadingOrders(true);
      try {
        const res = await fetch('http://localhost:7000/api/checkouts', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Gagal mengambil riwayat pesanan');
        const data = await res.json();
        const ordersData = data.success ? data.data : [];
        setOrders(
          ordersData.map((order: any) => ({
            id: order.id,
            order_code: order.order_code,
            createdAt: order.createdAt,
            status: order.status,
            total_amount: order.total_amount,
            items: (order.items || []).map((item: any) => ({
              produk: {
                name: item.produk?.name || 'Produk Tidak Diketahui',
                harga: item.harga ?? item.produk?.harga ?? 0,
                gambar: item.produk?.gambar || '',
              },
              quantity: item.quantity,
              ukuran: item.ukuran,
            })),
          }))
        );
      } catch (err) {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchCustomOrders = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setCustomOrders([]);
        return;
      }
      setLoadingCustomOrders(true);
      try {
        const res = await fetch('http://localhost:7000/api/custom-orders', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Gagal mengambil riwayat custom order');
        const data = await res.json();
        const ordersData = Array.isArray(data) ? data : (data.data || data.orders || []);
        setCustomOrders(
          ordersData.map((order: any) => ({
            id: order.id,
            createdAt: order.createdAt,
            status: order.status,
            flowerType: order.flowerType,
            flowerColor: order.flowerColor,
            size: order.size,
            arrangement: order.arrangement,
            deliveryDate: order.deliveryDate,
            imagePath: order.imagePath,
            notes: order.notes,
          }))
        );
      } catch (err) {
        setCustomOrders([]);
      } finally {
        setLoadingCustomOrders(false);
      }
    };
    fetchCustomOrders();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || !user?.id) return;

    try {
      setLoading(true);
      setMessage({ text: '', type: '' });

      const res = await fetch(`http://localhost:7000/api/edit/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username: form.username,
          email: user.role === 'admin' ? form.email : user.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Update gagal');
      // Refresh user data
      const userRes = await fetch('http://localhost:7000/api/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();
      setUser(userData.data);
      setMessage({ text: 'Profil berhasil diperbarui!', type: 'success' });
      setEdit(false);
    } catch (err: any) {
      setMessage({ text: err.message || 'Update gagal', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.replace('/login');
  };

  const handleCancel = () => {
    setForm({
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      password: user?.password || '',
    });
    setEdit(false);
    setMessage({ text: '', type: '' });
  };

  function toRupiah(x: number) {
    return 'Rp ' + (x || 0).toLocaleString('id-ID');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-pink-500">Memuat profil Anda...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <p className="text-red-500">Gagal memuat data profil</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 py-8 px-2 sm:px-6 lg:px-20 flex flex-col">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* PROFILE */}
        <div className="mt-32 w-full flex flex-col gap-4 bg-white/90 rounded-2xl shadow-xl border-t-8 border-pink-200 p-8">
          <h1 className="text-3xl font-extrabold text-center text-tomat mb-5 tracking-wide drop-shadow">Profil Saya</h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiUser className="mr-2" /> Username
              </label>
              {edit ? (
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                />
              ) : (
                <p className="text-lg font-semibold">{user.username}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiPhone className="mr-2" /> No. HP
              </label>
              {edit ? (
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                />
              ) : (
                <p className="text-lg font-semibold">{user.phone || '-'}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiKey className="mr-2" /> Password
              </label>
              {edit ? (
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="w-full mt-1 px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                />
              ) : (
                <p className="text-lg font-semibold">{user.password ? '●●●●●●●●' : '-'}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiMail className="mr-2" /> Email
              </label>
              {edit ? (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={user.role !== 'admin'}
                  className={`w-full mt-1 px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition ${
                    user.role !== 'admin' ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              ) : (
                <p className="text-lg font-semibold">{user.email}</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FiMapPin className="mr-2" /> Alamat
            </label>
            {edit ? (
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
              />
            ) : (
              <p className="text-lg font-semibold">{user.address || '-'}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <p className="text-lg font-semibold capitalize text-pink-400">{user.role}</p>
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-tomat to-dusty text-white rounded-lg shadow-lg hover:scale-105 transition"
            >
              <FiLogOut />
              Keluar
            </button>
            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-400 to-blue-200 text-white rounded-lg shadow-lg hover:scale-105 transition"
              >
                <FiEdit />
                Edit Profil
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </>
            )}
          </div>
          {message.text && (
            <div
              className={`mt-4 p-3 rounded-lg text-center font-semibold shadow-md ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 mb-10">
        {/* Riwayat Pemesanan */}
        <div className="bg-white/80 rounded-2xl shadow-xl border border-pink-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiShoppingCart className="text-pink-400 text-xl" />
            <h2 className="text-xl font-bold text-pink-500">Riwayat Pemesanan</h2>
          </div>
          {loadingOrders ? (
            <div className="py-8 text-pink-400 text-center animate-pulse">Memuat riwayat pesanan...</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-gray-400 text-center">Belum ada riwayat pemesanan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-xl mt-2">
                <thead className="bg-pink-50">
                  <tr>
                    <th className="py-2 px-2 text-left">Tanggal</th>
                    <th className="py-2 px-2 text-left">Status</th>
                    <th className="py-2 px-2 text-left">Total</th>
                    <th className="py-2 px-2 text-left">Produk</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b transition hover:bg-pink-50">
                      <td className="py-2 px-2">{order.createdAt ? new Date(order.createdAt).toLocaleString('id-ID') : '-'}</td>
                      <td className="py-2 px-2 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'completed'
                            ? 'Selesai'
                            : order.status === 'processing'
                            ? 'Diproses'
                            : order.status === 'pending'
                            ? 'Menunggu'
                            : 'Dibatalkan'
                          }
                        </span>
                      </td>
                      <td className="py-2 px-2 font-semibold text-blue-700">{toRupiah(order.total_amount)}</td>
                      <td className="py-2 px-2">
                        <ul>
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 mb-1">
                              {item.produk.gambar && (
                                <img
                                  src={`http://localhost:7000/upload/${item.produk.gambar}`}
                                  alt={item.produk.name}
                                  className="w-8 h-8 object-cover rounded"
                                  style={{ border: '1px solid #eee' }}
                                />
                              )}
                              <span>{item.produk.name}</span>
                              <span className="text-xs text-gray-500">x{item.quantity}</span>
                              <span className="text-xs text-gray-500">({item.ukuran})</span>
                              <span className="ml-2 text-xs text-blue-500">{toRupiah(item.produk.harga)}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Riwayat Custom Order */}
        <div className="bg-white/80 rounded-2xl shadow-xl border border-yellow-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiShoppingCart className="text-yellow-400 text-xl" />
            <h2 className="text-xl font-bold text-yellow-500">Riwayat Custom Order</h2>
          </div>
          {loadingCustomOrders ? (
            <div className="py-8 text-yellow-400 text-center animate-pulse">Memuat riwayat custom order...</div>
          ) : customOrders.length === 0 ? (
            <div className="py-8 text-gray-400 text-center">Belum ada riwayat custom order.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-xl mt-2">
                <thead className="bg-yellow-50">
                  <tr>
                    <th className="py-2 px-2 text-left">Tanggal</th>
                    <th className="py-2 px-2 text-left">Status</th>
                    <th className="py-2 px-2 text-left">Jenis Bunga</th>
                    <th className="py-2 px-2 text-left">Warna</th>
                    <th className="py-2 px-2 text-left">Ukuran</th>
                    <th className="py-2 px-2 text-left">Rangkaian</th>
                    <th className="py-2 px-2 text-left">Tgl Kirim</th>
                    <th className="py-2 px-2 text-left">Referensi</th>
                    <th className="py-2 px-2 text-left">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {customOrders.map(order => (
                    <tr key={order.id} className="border-b transition hover:bg-yellow-50">
                      <td className="py-2 px-2">{order.createdAt ? new Date(order.createdAt).toLocaleString('id-ID') : '-'}</td>
                      <td className="py-2 px-2 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'completed'
                            ? 'Selesai'
                            : order.status === 'processing'
                            ? 'Diproses'
                            : order.status === 'pending'
                            ? 'Menunggu'
                            : 'Dibatalkan'
                          }
                        </span>
                      </td>
                      <td className="py-2 px-2">{order.flowerType}</td>
                      <td className="py-2 px-2">{order.flowerColor}</td>
                      <td className="py-2 px-2">{order.size}</td>
                      <td className="py-2 px-2">{order.arrangement}</td>
                      <td className="py-2 px-2">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleString('id-ID') : '-'}</td>
                      <td className="py-2 px-2">
                        {order.imagePath && (
                          <img
                            src={`http://localhost:7000${order.imagePath}`}
                            alt="Referensi"
                            className="w-8 h-8 object-cover rounded"
                            style={{ border: '1px solid #eee' }}
                          />
                        )}
                      </td>
                      <td className="py-2 px-2">{order.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}