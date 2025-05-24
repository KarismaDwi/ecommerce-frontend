"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";

export default function DaftarProduk() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProduk = async () => {
      try {
        const res = await fetch("http://localhost:7000/api/produk");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      }
    };
    getProduk();
  }, []);

  return (
    <div id="daftar" className="relative mx-auto p-6 bg-aduh">
      <h1 className="text-3xl font-bold text-center mb-6">Flower Collection</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((product) => (
          <div
            key={product.id_produk}
            className="bg-pink-100 p-4 shadow-lg rounded-none transition duration-300 hover:scale-105 relative cursor-pointer"
            onClick={() => router.push(`/description/${product.id_produk}`)}
          >
            <Image
              src={`http://localhost:7000/upload/${product.gambar}`}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover rounded-none"
            />
            <div className="flex items-center justify-start mt-2">
              <FaStar className="text-yellow-500 mr-1" />
              <span className="text-md font-semibold">4.5</span> {/* Bisa diganti dengan rating jika ada */}
            </div>
            <h2 className="text-md font-semibold mt-1">{product.name}</h2>
            <div className="text-lg font-bold text-gray-800">
              IDR {parseInt(product.harga).toLocaleString("id-ID")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
