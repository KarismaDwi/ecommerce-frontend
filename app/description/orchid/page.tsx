"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoseDescription() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");

  const product = {
    name: "",
    description: "A beautiful bouquet of fresh red roses, perfect for any occasion.",
    price: 60,
    image: "/images/orchid.jpeg", // Sesuaikan dengan path gambar
    sizes: ["S", "M", "L"],
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItem = { ...product, quantity, size };
    localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
    router.push("/cart");
  };

  return (
    <div className="max-w-6xl mx-auto p-3 flex flex-col md:flex-row items-center gap-8">
      {/* Gambar di kiri */}
      <div className="w-full md:w-1/2">
        <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
      </div>

      {/* Informasi Produk di kanan */}
      <div className="w-full md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-xl font-semibold text-blue-600">${product.price}</p>

        {/* Pilih Ukuran */}
        <div className="flex gap-3">
          {["S", "M", "L"].map((s) => (
            <button
              key={s}
              className={`px-4 py-2 rounded border ${
                size === s ? "bg-slate-800 text-white" : "border-gray-400"
              }`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Pilih Quantity */}
        <div>
          <label className="font-semibold">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="ml-2 w-16 border rounded px-3 py-1 text-center"
            min="1"
          />
        </div>

        {/* Tombol Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-1/2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
