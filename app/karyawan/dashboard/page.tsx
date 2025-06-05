'use client';
import { useEffect, useRef, useState } from 'react';
import { FiUsers, FiShoppingCart, FiPackage, FiDollarSign, FiPieChart, FiUser } from 'react-icons/fi';
import Chart from 'chart.js/auto';

export default function DashboardPage() {
  const [karyawan, setKaryawan] = useState<any>(null);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [salesByCategory, setSalesByCategory] = useState<{ name: string, value: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentCustomOrders, setRecentCustomOrders] = useState<any[]>([]);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  const CATEGORY_LIST = [
    'custom', 'tanaman', 'aksesoris', 'dekor', 'bouquet', 'papan ucapan'
  ];

  useEffect(() => {
    // Fetch logged-in employee data
    const fetchKaryawan = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const res = await fetch('http://localhost:7000/api/karyawan', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (res.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          return;
        }

        const data = await res.json();
        setKaryawan(data);
      } catch (error) {
        console.error('Error fetching karyawan:', error);
      }
    };

    fetchKaryawan();

    // Fetch user data, filter only users with role 'user'
    fetch('http://localhost:7000/api/user')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTotalCustomers(data.filter((u) => u.role === 'user').length);
        } else if (Array.isArray(data.users)) {
          setTotalCustomers(data.users.filter((u: any) => u.role === 'user').length);
        } else {
          setTotalCustomers(0);
        }
      })
      .catch(() => setTotalCustomers(0));

    fetch('http://localhost:7000/api/produk')
      .then(res => res.json())
      .then(data => setTotalProducts(Array.isArray(data) ? data.length : 0))
      .catch(() => setTotalProducts(0));

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    Promise.all([
      fetch('http://localhost:7000/api/checkouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .catch(() => ({ data: [] })),
      fetch('http://localhost:7000/api/custom-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .catch(() => ({ data: [] }))
    ]).then(([checkoutRes, customOrderRes]) => {
      const orders = Array.isArray(checkoutRes)
        ? checkoutRes
        : Array.isArray(checkoutRes?.data)
          ? checkoutRes.data
          : [];

      const customOrders = Array.isArray(customOrderRes)
        ? customOrderRes
        : Array.isArray(customOrderRes?.data)
          ? customOrderRes.data
          : [];

      setTotalOrders(orders.length + customOrders.length);

      // Recent Orders (last 5)
      setRecentOrders([...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5));

      // Recent Custom Orders (last 5)
      setRecentCustomOrders([...customOrders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5));

      // Calculate revenue
      const completedOrders = orders.filter((order: any) => 
        (order.status || '').toLowerCase() === 'completed'
      );
      const revenueCheckout = completedOrders.reduce((sum: number, order: any) => 
        sum + (parseInt(order.total_amount) || 0), 0);

      const completedCustomOrders = customOrders.filter((order: any) => 
        (order.status || '').toLowerCase() === 'completed'
      );
      const revenueCustom = completedCustomOrders.reduce((sum: number, order: any) => 
        sum + (parseInt(order.total_amount) || parseInt(order.price) || 0), 0);

      setTotalRevenue(revenueCheckout + revenueCustom);

      // Calculate sales by category
      const categoryMap: Record<string, number> = {};
      CATEGORY_LIST.forEach(cat => { categoryMap[cat] = 0; });

      orders.forEach((order: any) => {
        if (!order.items) return;
        order.items.forEach((item: any) => {
          let cat = (item.produk?.kategori || '').toLowerCase().trim();
          if (!cat || !CATEGORY_LIST.includes(cat)) cat = 'lainnya';
          if (!categoryMap[cat]) categoryMap[cat] = 0;
          categoryMap[cat] += (item.quantity || 1);
        });
      });

      const categories = CATEGORY_LIST
        .map(cat => ({ name: cat, value: categoryMap[cat] }))
        .filter(cat => cat.value > 0);
      if (categoryMap['lainnya']) {
        categories.push({ name: 'Lainnya', value: categoryMap['lainnya'] });
      }
      setSalesByCategory(categories);
    })
    .catch(() => {
      setTotalOrders(0);
      setTotalRevenue(0);
      setSalesByCategory([]);
      setRecentOrders([]);
      setRecentCustomOrders([]);
    });
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    if (salesByCategory.length === 0) return;

    const total = salesByCategory.reduce((a, b) => a + b.value, 0);
    const colors = [
      '#60a5fa', // bunga
      '#fbbf24', // tanaman
      '#f87171', // aksesoris
      '#34d399', // dekor
      '#a78bfa', // bouquet
      '#f472b6', // papan ucapan
      '#facc15'  // lainnya
    ];

    chartInstance.current = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: salesByCategory.map(s => s.name),
        datasets: [{
          data: salesByCategory.map(s => s.value),
          backgroundColor: salesByCategory.map((_, i) => colors[i % colors.length]),
        }],
      },
      options: {
        plugins: {
          legend: { display: true, position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.raw || 0;
                const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percent}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [salesByCategory]);

  function toRupiah(x: number) {
    return 'Rp ' + (x || 0).toLocaleString('id-ID');
  }

  const summary = [
    {
      title: 'Total Pesanan',
      value: totalOrders,
      icon: <FiShoppingCart className="text-blue-600 text-3xl" />,
      color: 'bg-gradient-to-r from-blue-100 to-blue-50',
      shadow: 'shadow-blue-200'
    },
    {
      title: 'Total Pelanggan',
      value: totalCustomers,
      icon: <FiUsers className="text-green-600 text-3xl" />,
      color: 'bg-gradient-to-r from-green-100 to-green-50',
      shadow: 'shadow-green-200'
    },
    {
      title: 'Produk',
      value: totalProducts,
      icon: <FiPackage className="text-purple-600 text-3xl" />,
      color: 'bg-gradient-to-r from-purple-100 to-purple-50',
      shadow: 'shadow-purple-200'
    },
    {
      title: 'Pendapatan',
      value: toRupiah(totalRevenue),
      icon: <FiDollarSign className="text-yellow-600 text-3xl" />,
      color: 'bg-gradient-to-r from-yellow-100 to-yellow-50',
      shadow: 'shadow-yellow-200'
    },
  ];

  return (
    <div className='ml-72 min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 py-10 px-4'>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-pink-700 tracking-wide flex items-center gap-3">
          <FiPieChart className="text-pink-400" />
          Dashboard
        </h1>

        {/* Employee Profile Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row md:items-center gap-4">
          {karyawan ? (
            <>
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                <FiUser className="text-pink-500 text-2xl" />
              </div>
              <div>
                <div className="font-bold text-pink-700 text-lg">{karyawan.username}</div>
                <div className="text-gray-600 text-sm">{karyawan.email}</div>
                <div className="text-gray-500 text-sm">{karyawan.phone}</div>
                <div className="text-gray-500 text-sm">{karyawan.address}</div>
                <div className="inline-block mt-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                  {karyawan.role}
                </div>
              </div>
            </>
          ) : (
            <div className="italic text-gray-400">Memuat data karyawan...</div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {summary.map((item) => (
            <div
              key={item.title}
              className={`p-6 rounded-2xl flex items-center gap-4 ${item.color} ${item.shadow} hover:scale-105 transition shadow-xl`}
            >
              <div>{item.icon}</div>
              <div>
                <div className="text-2xl font-extrabold">{item.value}</div>
                <div className="text-gray-500 text-sm font-semibold">{item.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Sales by Category Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4 w-full text-center text-blue-700">Penjualan per Kategori</h2>
            {salesByCategory.length === 0 ? (
              <div className="text-gray-400 py-12">Belum ada data penjualan.</div>
            ) : (
              <>
                <div className="w-full flex flex-col items-center">
                  <canvas ref={chartRef} width={280} height={280}></canvas>
                  <div className="mt-5 flex flex-wrap justify-center gap-4">
                    {salesByCategory.map((cat, i) => {
                      const total = salesByCategory.reduce((a, b) => a + b.value, 0);
                      const percent = total ? ((cat.value / total) * 100).toFixed(1) : 0;
                      const color = [
                        '#60a5fa', // bunga
                        '#fbbf24', // tanaman
                        '#f87171', // aksesoris
                        '#34d399', // dekor
                        '#a78bfa', // bouquet
                        '#f472b6', // papan ucapan
                        '#facc15'  // lainnya
                      ][i % 7];
                      return (
                        <span key={cat.name} className="flex items-center gap-2 text-sm font-medium">
                          <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} />
                          {cat.name} <span className="text-gray-500">({percent}%)</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-lg font-bold mb-4 text-blue-700">Pesanan Terbaru</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-pink-700 bg-pink-50 border-b">
                    <th className="py-2">Order</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Produk</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id || idx} className="border-b hover:bg-yellow-50 align-top transition">
                      <td className="py-3">
                        <div className="font-mono font-bold text-blue-700">{order.order_code}</div>
                        <div className="text-xs text-gray-400">ID: {order.id}</div>
                      </td>
                      <td>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : '-'}
                      </td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.status === 'completed'
                            ? 'Selesai'
                            : order.status === 'pending'
                            ? 'Menunggu'
                            : order.status === 'processing'
                            ? 'Diproses'
                            : 'Dibatalkan'
                          }
                        </span>
                      </td>
                      <td className="font-semibold text-pink-700">{toRupiah(order.total_amount)}</td>
                      <td>
                        <ul className="list-disc ml-4 text-xs">
                          {(order.items || []).map((item: any, i: number) => (
                            <li key={item.id || i} className="mb-1">
                              <span className="font-semibold">{item.produk?.name}</span>
                              {item.ukuran && <span className="ml-1 text-gray-500 text-xs">({item.ukuran})</span>}
                              <span className="ml-2 text-gray-600">x{item.quantity}</span>
                              <span className="ml-2 text-gray-400">{toRupiah(item.harga)}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-400">
                        Tidak ada pesanan terbaru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Custom Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-12">
          <h2 className="text-lg font-bold mb-4 text-blue-700">Custom Order Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-pink-700 bg-pink-50 border-b">
                  <th className="py-2">Order</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Jenis Bunga</th>
                  <th>Warna</th>
                  <th>Ukuran</th>
                  <th>Rangkaian</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentCustomOrders.map((order, idx) => (
                  <tr key={order.id || idx} className="border-b hover:bg-yellow-50 align-top transition">
                    <td className="py-3 font-mono font-semibold text-blue-700">
                      CUSTOM-{order.id}
                    </td>
                    <td>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.status === 'completed'
                          ? 'Selesai'
                          : order.status === 'pending'
                          ? 'Menunggu'
                          : order.status === 'processing'
                          ? 'Diproses'
                          : 'Dibatalkan'
                        }
                      </span>
                    </td>
                    <td>{order.flowerType || '-'}</td>
                    <td>{order.flowerColor || '-'}</td>
                    <td>{order.size || '-'}</td>
                    <td>{order.arrangement || '-'}</td>
                  </tr>
                ))}
                {recentCustomOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      Tidak ada custom order terbaru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}