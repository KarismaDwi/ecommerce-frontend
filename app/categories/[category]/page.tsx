// import ProductCard from "../../components/productCard";
// import { Produk } from "../../../types/produk";

// export default async function CategoryPage({
//   params,
// }: {
//   params: { category: string };
// }) {
//   const categoryMap: Record<string, string> = {
//     flowers: "flower",
//     plants: "plant",
//     accessories: "accessories",
//     decor: "decor",
//     bouquet: "bouquet",
//   };

//   const dbCategory = categoryMap[params.category] || params.category;

//   const res = await fetch(
//     `http://localhost:7000/api/produk?kategori=${dbCategory}`,
//     { cache: "no-store" }
//   );
//   const products: Produk[] = await res.json();

//   const categoryTitles: Record<string, string> = {
//     flowers: "Bunga",
//     plants: "Tanaman",
//     accessories: "Aksesoris",
//     decor: "Dekorasi",
//     bouquet: "Buket",
//   };

//   const title = categoryTitles[params.category] || params.category;

//   return (
//     <div className="container mx-auto px-4 py-8 mt-20">
//       <h1 className="text-3xl font-bold mb-8 capitalize">{title}</h1>

//       {products.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <ProductCard key={product.id_produk} product={product} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-center py-12">
//           Tidak ada produk dalam kategori ini
//         </p>
//       )}
//     </div>
//   );
// }
