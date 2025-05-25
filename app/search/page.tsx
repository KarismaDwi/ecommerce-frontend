"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaArrowLeft, FaStar, FaTag, FaTint, FaLeaf } from "react-icons/fa";

interface Product {
  id_produk: number;
  name: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  kategori: string;
  warna: string;
  ukuran: string;
  rating?: number;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;

    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:7000/api/search?keyword=${keyword}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  if (!keyword) {
    return (
      <div className="min-h-screen pt-32 px-4 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
        <div className="max-w-6xl mx-auto py-8 text-center">
          <div className="flex justify-center mb-4">
            <FaSearch className="text-4xl text-pink-300" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-pink-700">Cari Produk</h1>
          <p className="text-gray-600 mb-6">Masukkan kata kunci untuk mencari produk</p>
          <Link
            href="/"
            className="inline-flex items-center text-pink-500 hover:text-pink-700 font-semibold"
          >
            <FaArrowLeft className="mr-2" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-2">
            Hasil pencarian untuk "<span className="text-yellow-500">{keyword}</span>"
          </h1>
          <p className="text-gray-600 text-base">
            {products.length} {products.length === 1 ? "produk" : "produk"} ditemukan
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-pink-100 h-64 rounded-2xl mb-3"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-pink-100 rounded"></div>
                  <div className="h-4 bg-pink-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <FaSearch className="text-4xl text-pink-300" />
            </div>
            <h2 className="text-xl font-medium mb-2 text-pink-700">Produk tidak ditemukan</h2>
            <p className="text-gray-600 mb-6">
              Tidak dapat menemukan produk dengan kata kunci "{keyword}"
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-pink-500 hover:text-pink-700 font-semibold"
            >
              <FaArrowLeft className="mr-2" /> Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id_produk}
                className="bg-white/80 shadow-xl p-4 rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative cursor-pointer group border-t-4 border-pink-200"
                onClick={() => router.push(`/description/${product.id_produk}`)}
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow mb-3 bg-pink-50">
                  <Image
                    src={`http://localhost:7000/upload/${product.gambar}`}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={products.indexOf(product) < 4}
                  />
                  {/* <span className="absolute top-3 left-3 bg-yellow-200 text-yellow-700 rounded-full text-xs px-3 py-1 font-semibold shadow">
                    {product.ukuran}
                  </span> */}
                </div>
                <div className="p-2">
                  <div className="flex justify-between items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1">{product.name}</h2>
                    <div className="flex items-center bg-pink-100 px-2 py-1 rounded-full text-xs font-semibold shadow">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{product.rating ? product.rating.toFixed(1) : "4.7"}</span>
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
        )}
      </div>
    </div>
  );
}