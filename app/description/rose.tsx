"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RoseDescription() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");

  const handleAddToCart = () => {
    const product = {
      name: "Red Rose Bouquet",
      price: 25,
      quantity,
      size,
      image: "/images/rose.jpg",
    };

    localStorage.setItem("cart", JSON.stringify(product));
    router.push("/cart");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row">
        {/* Gambar Produk */}
        <div className="md:w-1/2">
          <Image
            src="/images/rose.jpg"
            alt="Red Rose Bouquet"
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>

        {/* Informasi Produk */}
        <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0">
          <h2 className="text-2xl font-bold">Red Rose Bouquet</h2>
          <p className="text-gray-600 mt-2">A beautiful bouquet of fresh red roses, perfect for any occasion.</p>
          <p className="text-lg font-semibold text-red-500 mt-2">$25.00</p>

          {/* Pilihan Ukuran */}
          <div className="mt-4">
            <label className="font-semibold">Size:</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="ml-2 p-2 border rounded"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </div>

          {/* Pilihan Quantity */}
          <div className="mt-4">
            <label className="font-semibold">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="ml-2 p-2 w-16 border rounded"
            />
          </div>

          {/* Tombol Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
