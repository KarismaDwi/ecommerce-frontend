'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { AiFillStar, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

interface Produk {
  id_produk: number;
  name: string;
  harga: number;
  deskripsi: string;
  stok: number;
  gambar: string;
  ukuran: string;
  warna: string;
  kategori: string;
}

const ukuranList = [
  { label: 'Spray', desc: '± 10 cm' },
  { label: 'Standard bloom', desc: '± 20 cm' },
  { label: 'Full bloom', desc: '± 30 cm' },
  { label: 'Bud', desc: '± 8 cm' },
  { label: 'Mini bouquet', desc: '± 15 cm' },
  { label: 'Grand bouquet', desc: '± 50 cm' },
];

export default function HalamanDetailProduk() {
  const params = useParams();
  const id_produk = Array.isArray(params?.id_produk) ? params.id_produk[0] : params?.id_produk;
  const router = useRouter();

  const [produk, setProduk] = useState<Produk | null>(null);
  const [ukuranTerpilih, setUkuranTerpilih] = useState<{ label: string; desc: string } | null>(null);
  const [favorit, setFavorit] = useState(false);
  const [jumlah, setJumlah] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingCart, setLoadingCart] = useState(false);
  const [errorUkuran, setErrorUkuran] = useState('');

  useEffect(() => {
    const ambilProduk = async () => {
      try {
        setLoading(true);
        const numericId = Number(id_produk);
        if (isNaN(numericId)) throw new Error('ID produk tidak valid');
        const res = await axios.get(`http://localhost:7000/api/produk/${numericId}`);
        if (!res.data) throw new Error('Produk tidak ditemukan');
        setProduk(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Gagal mengambil data produk');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id_produk) ambilProduk();
  }, [id_produk]);

  const pilihUkuran = (label: string) => {
    const ukuran = ukuranList.find((u) => u.label === label);
    if (ukuran) {
      setUkuranTerpilih(ukuran);
      setErrorUkuran('');
    }
  };

  const validasi = () => {
    if (!ukuranTerpilih) {
      setErrorUkuran('Pilih ukuran terlebih dahulu');
      return false;
    }
    if (produk && !produk.ukuran.split(',').map(u => u.trim()).includes(ukuranTerpilih.label)) {
      setErrorUkuran('Ukuran tidak tersedia untuk produk ini');
      return false;
    }
    return true;
  };

  const tambahKeKeranjang = async () => {
    if (!validasi() || !produk) return;

    setLoadingCart(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.post(
        'http://localhost:7000/api/cart',
        {
          product_id: produk.id_produk,
          quantity: jumlah,
          ukuran: ukuranTerpilih.label,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      alert('Produk berhasil ditambahkan ke keranjang');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          alert(err.response?.data?.error || 'Gagal menambahkan ke keranjang');
        }
      } else {
        alert('Terjadi kesalahan');
      }
    } finally {
      setLoadingCart(false);
    }
  };

  const beliLangsung = async () => {
    if (!validasi() || !produk) return;

    setLoadingCart(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.post(
        'http://localhost:7000/api/cart',
        {
          product_id: produk.id_produk,
          quantity: jumlah,
          ukuran: ukuranTerpilih.label,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      router.push('/checkout');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          alert(err.response?.data?.message || 'Gagal melakukan checkout');
        }
      } else {
        alert('Terjadi kesalahan saat pembelian');
      }
    } finally {
      setLoadingCart(false);
    }
  };

  const ubahJumlah = (jumlahBaru: number) => {
    if (produk && jumlahBaru > 0 && jumlahBaru <= produk.stok && jumlahBaru <= 10) {
      setJumlah(jumlahBaru);
    }
  };

  const ukuranTersedia = (label: string) => {
    if (!produk?.ukuran) return false;
    const tersedia = produk.ukuran.split(',').map((u) => u.trim());
    return tersedia.includes(label);
  };

  if (loading) 
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-pink-500"></div>
        <span className="ml-4 text-pink-600 font-semibold text-lg">Memuat...</span>
      </div>
    );
  if (error) 
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <span className="text-xl font-bold mb-2">Oops!</span>
        <span>{error}</span>
      </div>
    );
  if (!produk) 
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <span className="text-xl font-bold mb-2">Produk tidak ditemukan</span>
      </div>
    );

  return (
    <div className="mt-14 min-h-screen pt-28 pb-16 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="mb-8 text-sm md:text-base text-pink-600 hover:text-pink-800 flex items-center transition-all group"
        >
          <span className="mr-1 group-hover:-translate-x-1 transition-transform">←</span>
          Kembali ke Produk
        </button>

        <div className="flex flex-col md:flex-row gap-14 md:gap-20 bg-white/90 rounded-3xl shadow-2xl border-t-8 border-pink-200 p-6 md:p-12">
          {/* Gambar */}
          <div className="w-full md:w-2/5">
            <div className="relative aspect-square bg-tomat/10 rounded-2xl shadow-lg overflow-hidden group">
              <Image
                src={`http://localhost:7000/upload/${produk.gambar}`}
                alt={produk.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <button
                onClick={() => setFavorit(!favorit)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition"
                type="button"
                aria-label="Tambah ke favorit"
              >
                {favorit ? (
                  <AiFillHeart size={28} className="text-red-500 drop-shadow" />
                ) : (
                  <AiOutlineHeart size={28} className="text-gray-500 drop-shadow" />
                )}
              </button>
            </div>
          </div>

          {/* Info Produk */}
          <div className="w-full md:w-3/5 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-pink-700 drop-shadow">{produk.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-base text-gray-600">
              <AiFillStar className="text-yellow-400" />
              <span className="font-medium">4.7 / 5</span>
              <span className="ml-3 px-3 py-1 rounded-full text-xs bg-pink-50 text-pink-700 font-semibold">
                {produk.kategori}
              </span>
              <span className="ml-1 px-3 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700 font-semibold">
                {produk.warna}
              </span>
            </div>

            <p className="text-gray-700 mt-6 leading-relaxed text-lg">{produk.deskripsi}</p>

            <div className="mt-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-pink-600 drop-shadow">
                Rp {produk.harga.toLocaleString('id-ID')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Stok tersedia: <span className="font-semibold">{produk.stok}</span>
              </p>
            </div>

            {/* Pilih Ukuran */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">PILIH UKURAN *</h3>
              <div className="flex flex-wrap gap-3">
                {ukuranList.map((u) => (
                  <button
                    key={u.label}
                    onClick={() => pilihUkuran(u.label)}
                    disabled={!ukuranTersedia(u.label)}
                    className={`px-5 py-2 border rounded-full text-sm shadow font-bold tracking-wide transition-all
                      ${ukuranTerpilih?.label === u.label
                        ? 'bg-pink-600 text-white border-pink-600 shadow-lg'
                        : 'border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50'}
                      ${!ukuranTersedia(u.label) && 'opacity-30 cursor-not-allowed'}`}
                  >
                    {u.label}
                    <span className="ml-2 text-xs text-gray-400">{u.desc}</span>
                  </button>
                ))}
              </div>
              {errorUkuran && (
                <p className="mt-2 text-sm text-red-500">{errorUkuran}</p>
              )}
            </div>

            {/* Jumlah & Tombol */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <input
                type="number"
                min={1}
                max={produk.stok}
                value={jumlah}
                onChange={(e) => ubahJumlah(parseInt(e.target.value))}
                className="w-24 border-2 border-pink-200 rounded-xl px-3 py-2 text-center shadow focus:border-pink-500 focus:ring-pink-300 focus:ring-2 transition"
              />
              <div className="flex gap-4">
                <button
                  onClick={tambahKeKeranjang}
                  disabled={loadingCart}
                  className="bg-gradient-to-r from-pink-400 to-yellow-300 hover:from-pink-500 hover:to-yellow-400 text-white px-6 py-2 rounded-xl shadow-lg font-bold tracking-wide transition-all"
                >
                  + Keranjang
                </button>
                <button
                  onClick={beliLangsung}
                  disabled={loadingCart}
                  className="bg-gradient-to-r from-tomat to-pink-500 hover:from-pink-600 hover:to-tomat text-white px-6 py-2 rounded-xl shadow-lg font-bold tracking-wide transition-all"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}