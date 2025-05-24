"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";

const products = [
  { id: 1, name: "Rose Bouquet", price: 250000, image: "/images/rose.jpeg", link: "/description/rose", rating: 4.5 },
  { id: 2, name: "Tulip Basket", price: 300000, image: "/images/tulip.jpeg", link: "/description/tulip", rating: 4.2 },
  { id: 3, name: "Sunflower Set", price: 200000, image: "/images/sunflower.jpeg", link: "/description/sunflower", rating: 4.8 },
  { id: 4, name: "Orchid Elegance", price: 400000, image: "/images/orchid.jpeg", link: "/description/orchid", rating: 4.7 },
  { id: 5, name: "Lily Love", price: 280000, image: "/images/lily.jpeg", link: "/description/lily", rating: 4.3 },
  { id: 6, name: "Daisy Delight", price: 180000, image: "/images/daisy.jpeg", link: "/description/daisy", rating: 4.1 },
  { id: 7, name: "Carnation Charm", price: 220000, image: "/images/carnation.jpeg", link: "/description/carnation", rating: 4.4 },
  { id: 8, name: "Peony Passion", price: 350000, image: "/images/peony.jpeg", link: "/description/peony", rating: 4.6 },
];

export default function DaftarProduk() {
  const router = useRouter();

  return (
    <div id="daftar" className="relative mx-auto p-6 bg-aduh pt-40">
      <h1 className="text-3xl font-bold text-center mb-6">Bunga</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-pink-100 p-4 shadow-lg rounded-none transition duration-300 hover:scale-105 relative cursor-pointer"
            onClick={() => router.push(product.link)}
          >
            <Image 
              src={product.image} 
              alt={product.name} 
              width={300} 
              height={300} 
              className="w-full h-64 object-cover rounded-none"
            />
            <div className="flex items-center justify-start mt-2">
              <FaStar className="text-yellow-500 mr-1" />
              <span className="text-md font-semibold">{product.rating}</span>
            </div>
            <h2 className="text-md font-semibold mt-1">{product.name}</h2>
            <div className="text-lg font-bold text-gray-800">IDR {product.price.toLocaleString("id-ID")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
