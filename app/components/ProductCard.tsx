import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }: {
  product: {
    id_produk: number;
    nama_produk: string;
    harga: number;
    gambar: string;
    stok: number;
    kategori: string;
  }
}) {
  return (
    <Link 
      href={`/produk/${product.id_produk}`}
      className="group block overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.gambar}`}
          alt={product.nama_produk}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg group-hover:text-pink-600 transition">
          {product.nama_produk}
        </h3>
        <p className="text-gray-800 font-semibold mt-1">
          Rp {product.harga.toLocaleString("id-ID")}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500 capitalize">
            {product.kategori}
          </span>
          <span className={`text-sm ${
            product.stok > 0 ? "text-green-600" : "text-red-600"
          }`}>
            {product.stok > 0 ? "Tersedia" : "Habis"}
          </span>
        </div>
      </div>
    </Link>
  );
}