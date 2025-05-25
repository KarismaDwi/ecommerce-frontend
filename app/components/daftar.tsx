"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar, FaLeaf, FaTint, FaTag } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Product {
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

export default function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:7000/api/produk");
        setProducts(res.data);
      } catch (err) {
        setError("Gagal memuat produk");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const navigateToProductDetail = (id_produk: number) => {
    router.push(`/description/${id_produk}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="border-4 border-pink-200 border-t-pink-500 rounded-full w-14 h-14 animate-spin mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-pink-600 font-semibold">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex items-center justify-center">
        <div className="text-center text-pink-500">
          <p className="text-xl font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow hover:scale-105 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto p-6 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-pink-700 mb-2 tracking-wide drop-shadow">Koleksi Bunga</h1>
        <p className="text-gray-600 text-lg">Temukan berbagai pilihan bunga indah, segar, dan berkualitas untuk segala momen spesial Anda!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-12">
        {products.slice(0, 8).map((product) => (
          <div
            key={product.id_produk}
            className="bg-white/80 p-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group border-t-4 border-pink-200"
            onClick={() => navigateToProductDetail(product.id_produk)}
          >
            {/* Square Image */}
            <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow mb-3 bg-pink-50">
              <Image
                src={`http://localhost:7000/upload/${product.gambar}`}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority={products.indexOf(product) < 4}
              />
              <span className="absolute top-3 left-3 bg-yellow-200 text-yellow-700 rounded-full text-xs px-3 py-1 font-semibold shadow">
                Stok: {product.stok}
              </span>
            </div>
            <div className="p-2">
              <div className="flex justify-between items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1">{product.name}</h2>
                <div className="flex items-center bg-pink-100 px-2 py-1 rounded-full text-xs font-semibold shadow">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>4.7</span>
                </div>
              </div>
              <div className="mt-2 text-xl font-extrabold text-pink-600">
                Rp {product.harga.toLocaleString("id-ID")}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 bg-pink-50 text-pink-500 px-2 py-1 rounded text-xs font-medium">
                  <FaTag /> {product.kategori}
                </span>
                <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded text-xs font-medium">
                  <FaTint /> {product.warna}
                </span>
                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  <FaLeaf /> {product.ukuran}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Tidak ada produk tersedia</p>
        </div>
      )}
    </div>
  );
}