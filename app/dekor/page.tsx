"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaStar, FaTag } from "react-icons/fa";

interface Product {
  id_produk: number;
  name: string;
  harga: number;
  gambar: string;
  kategori: string;
  rating?: number;
}

export default function DaftarProduk() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccessoryProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:7000/api/search?keyword=dekor`
        );
        const data = await response.json();

        // Filter to ensure only 'dekor' category is shown
        const accessoryProducts = Array.isArray(data)
          ? data.filter((product: Product) =>
              product.kategori?.toLowerCase().includes("dekor") ||
              product.name?.toLowerCase().includes("dekor")
            )
          : [];

        setProducts(accessoryProducts);
      } catch (error) {
        console.error("Error fetching accessory products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccessoryProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="relative mx-auto p-6 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 min-h-screen">
        <h1 className="text-3xl font-extrabold text-center mb-10 text-pink-700 tracking-wide drop-shadow">
          Dekorasi & Pernak-pernik
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white/80 p-4 rounded-2xl shadow-xl h-80 animate-pulse">
              <div className="w-full h-48 bg-pink-100 rounded-xl mb-3"></div>
              <div className="h-5 bg-pink-100 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-pink-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-32 mx-auto p-6 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-10 text-pink-700 tracking-wide drop-shadow">
        Dekorasi & Pernak-pernik
      </h1>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">Tidak ada produk dekorasi ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10">
          {products.map((product) => (
            <div
              key={product.id_produk}
              className="bg-white/80 p-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group border-t-4 border-pink-200"
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
                <span className="absolute top-3 left-3 bg-yellow-200 text-yellow-700 rounded-full text-xs px-3 py-1 font-semibold shadow flex items-center">
                  <FaTag className="inline mr-1" /> {product.kategori}
                </span>
              </div>
              <div className="p-2">
                <div className="flex justify-between items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1">{product.name}</h2>
                  <div className="flex items-center bg-pink-100 px-2 py-1 rounded-full text-xs font-semibold shadow">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{product.rating ? product.rating.toFixed(1) : "4.6"}</span>
                  </div>
                </div>
                <div className="mt-2 text-xl font-extrabold text-pink-600">
                  Rp{product.harga.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}