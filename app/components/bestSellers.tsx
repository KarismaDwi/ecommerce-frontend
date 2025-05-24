"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";

const bestSellers = [
  { id: 1, name: "Rose Bouquet", price: 25, image: "/images/rose.jpeg", link: "/description/rose", rating: 4.9 },
  { id: 2, name: "Tulip Basket", price: 30, image: "/images/tulip.jpeg", link: "/description/tulip", rating: 4.8 },
  { id: 3, name: "Sunflower Set", price: 20, image: "/images/sunflower.jpeg", link: "/description/sunflower", rating: 4.7 },
  { id: 4, name: "Orchid Elegance", price: 40, image: "/images/orchid.jpeg", link: "/description/orchid", rating: 5.0 },
];

export default function BestSellerProducts() {
  const router = useRouter();

  return (
    <div id="bestsellers" className="relative mx-auto p-6 bg-yellow-300">
      <h1 className="text-3xl font-bold text-center mb-6">Best Sellers</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <div
            key={product.id}
            className="bg-yellow-200 p-4 shadow-lg rounded-xl transition duration-300 hover:scale-105 relative"
            onClick={() => router.push(product.link)}
          >
            <div className="absolute top-2 right-2 text-lg font-bold bg-white px-3 py-1 rounded-lg shadow-md">
              ${product.price}
            </div>
            <Image 
              src={product.image} 
              alt={product.name} 
              width={300} 
              height={300} 
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex items-center justify-start mt-2">
              <FaStar className="text-yellow-500 mr-1" />
              <span className="text-md font-semibold">{product.rating}</span>
            </div>
            <h2 className="text-md font-semibold mt-1">{product.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
