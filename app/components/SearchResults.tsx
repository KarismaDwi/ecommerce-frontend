"use client";

import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";

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

interface SearchResultsProps {
  results: Product[];
  domain?: string;
}

export default function SearchResults({ results, domain }: SearchResultsProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts(results);
    setLoading(false);
  }, [results]);

  const navigateToProductDetail = (id_produk: number) => {
    router.push(`/description/${id_produk}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
          <p className="text-base sm:text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
 <div className="relative mx-auto p-6 bg-aduh">
 
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {products.slice(0, 8).map((product) => (
           <div
             key={product.id_produk}
              className="bg-pink-100 p-4 shadow-lg rounded-none transition duration-300 hover:scale-105 relative cursor-pointer"
             onClick={() => navigateToProductDetail(product.id_produk)}
           >
             {/* Square 4:4 Image Container */}
             <div className="relative w-full aspect-square overflow-hidden rounded-t">
               <Image
                 src={`http://localhost:7000/upload/${product.gambar}`}
                 alt={product.name}
                 fill
                 className="object-cover group-hover:scale-105 transition-transform duration-300"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                 priority={products.indexOf(product) < 4}
               />
             </div>
             <div className="p-4">
               <div className="flex justify-between items-start gap-2">
                 <h2 className="text-base sm:text-lg font-semibold line-clamp-2">{product.name}</h2>
                 <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm flex-shrink-0">
                   <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm" />
                   <span>4.5</span>
                 </div>
               </div>
               <div className="mt-2 text-base sm:text-lg font-bold text-gray-900">
                 Rp {product.harga.toLocaleString("id-ID")}
               </div>
               <div className="mt-1 text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                 <span>{product.kategori}</span>
                 <span>•</span>
                 <span>{product.warna}</span>
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