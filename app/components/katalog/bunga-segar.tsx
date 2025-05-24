"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Daftar produk Bunga Segar
const products = [
  { id: 1, name: "Rose Bouquet", price: 25, image: "/images/rose.jpeg", description: "Elegant red roses, perfect for romantic occasions." },
  { id: 2, name: "Tulip Basket", price: 30, image: "/images/tulip.jpeg", description: "A colorful collection of fresh tulips in a charming basket." },
  { id: 3, name: "Sunflower Set", price: 20, image: "/images/sunflower.jpeg", description: "Bright sunflowers that bring warmth and happiness." },
  { id: 4, name: "Orchid Elegance", price: 40, image: "/images/orchid.jpeg", description: "Exquisite orchids that symbolize luxury and beauty." },
  { id: 5, name: "Lily Love", price: 28, image: "/images/lily.jpeg", description: "Soft and graceful lilies to express purity and devotion." },
  { id: 6, name: "Daisy Delight", price: 18, image: "/images/daisy.jpeg", description: "A bouquet of cheerful daisies to brighten any day." },
  { id: 7, name: "Carnation Charm", price: 22, image: "/images/carnation.jpeg", description: "Classic carnations in a variety of vibrant colors." },
  { id: 8, name: "Peony Passion", price: 35, image: "/images/peony.jpeg", description: "Lush and fragrant peonies for a luxurious touch." },
];

export default function BungaSegar() {
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(savedCart)) {
      setCart(savedCart);
    } else {
      setCart([]);
    }
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setSize("M");
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    const existingCart = Array.isArray(cart) ? [...cart] : [];
    const existingItem = existingCart.find((item) => item.id === selectedProduct.id && item.size === size);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      existingCart.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        image: selectedProduct.image,
        price: selectedProduct.price,
        size,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
    
    closeModal();
    router.push("/cart");
  };

  const handleOrderNow = () => {
    if (!selectedProduct) return;

    const orderData = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: selectedProduct.price,
      size,
      quantity,
    };
    
    localStorage.setItem("orderNow", JSON.stringify(orderData));
    router.push("/checkout");
  };

  return (
    <div id="bunga-segar" className="relative mx-auto p-6 bg-blue-300">
      <h1 className="text-3xl font-bold text-center mb-6">Flower Collection - Bunga Segar</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-blue-200 p-4 shadow-lg rounded-xl text-center transition duration-300 hover:scale-105"
          >
            <Image 
              src={product.image} 
              alt={product.name} 
              width={300} 
              height={300} 
              className="w-full h-64 object-cover rounded-lg"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-500 text-sm italic">{product.description}</p>
            <p className="text-gray-800 font-bold mt-2">${product.price}</p>
            <div className="mt-3 flex justify-center gap-3">
              <button
                className="bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                onClick={() => openModal(product)}
              >
                Add to Cart
              </button>
              <button
                className="bg-teal-800 text-white px-4 py-2 rounded-lg hover:bg-teal-950"
                onClick={() => openModal(product)}
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{selectedProduct.name}</h2>
            <label className="block mb-2">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">Size:</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
            <div className="flex justify-between mt-4">
              <button className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={closeModal}>Cancel</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700" onClick={handleOrderNow}>Order Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
