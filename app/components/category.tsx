import Link from "next/link";

const categories = [
  { name: "Bunga Segar", slug: "/katalog" },
  { name: "Buket Bunga", slug: "/katalog/buket-bunga" },
  { name: "Tanaman Hias", slug: "/katalog/tanaman-hias" },
];

const centeredCategories = [
  { name: "Bunga Kering", slug: "/katalog/bunga-kering" },
  { name: "Dekorasi Pernikahan", slug: "/katalog/dekorasi-pernikahan" },
];

export default function CategoryList() {
  return (
    <div id="category" className="p-6 bg-blue-300">
      <h2 className="text-2xl font-bold mb-4 text-center">Kategori</h2>

      {/* Kategori Atas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link key={category.name} href={category.slug}>
            <li className="block p-4 bg-purple-300 rounded-lg text-center text-lg font-semibold hover:bg-purple-500 transition">
              {category.name}
            </li>
          </Link>
        ))}
      </div>

      {/* Kategori Tengah (Bunga Kering & Dekorasi Pernikahan) */}
      <div className="flex justify-center mt-4">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {centeredCategories.map((category) => (
            <Link key={category.name} href={category.slug}>
              <li className="block p-4 bg-purple-300 rounded-lg text-center text-lg font-semibold hover:bg-purple-500 transition">
                {category.name}
              </li>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
