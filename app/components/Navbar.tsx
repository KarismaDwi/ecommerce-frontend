"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaInstagram, FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]); // Menyimpan hasil pencarian
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [debouncedSearchText, setDebouncedSearchText] = useState(""); // State untuk debounce
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");
  }, []);

  // Debounce fungsi
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // Tunggu 500ms setelah pengguna berhenti mengetik

    return () => clearTimeout(timer); // Bersihkan timeout saat searchText berubah
  }, [searchText]);

  // Menangani pencarian saat debounced searchText berubah
  useEffect(() => {
    const searchProduct = async () => {
      if (debouncedSearchText.trim() === "") {
        setProducts([]); // Jika input kosong, kosongkan hasil
        return;
      }

      try {
        // Gunakan fetch untuk menggantikan axios
        const response = await fetch(`http://localhost:7000/api/search?keyword=${debouncedSearchText}`);
        const data = await response.json(); // Parse data yang diterima

        if (Array.isArray(data)) {
          setProducts(data); // Simpan hasil pencarian ke state
        } else {
          console.error("Data yang diterima tidak sesuai:", data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    searchProduct();
  }, [debouncedSearchText]);

  const handleHomeClick = () => {
    router.push("/"); // Navigate to homepage (page.tsx)
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 h-20">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Instagram & Logo */}
        <div className="flex items-center gap-6">
          <FaInstagram className="text-2xl cursor-pointer" />
          <h1 className="text-2xl font-bold tracking-wide">turbopetals</h1>
        </div>

        {/* Search Bar, User, Cart */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-40 sm:w-60 md:w-72 lg:w-80 px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)} // Update searchText saat pengguna mengetik
            />
          </div>

          {/* User Icon */}
          <Link href={isAuthenticated ? "/profile" : "/login"}>
            <FaUser className="text-xl cursor-pointer hover:text-dusty" />
          </Link>

          {/* Cart Icon */}
          <Link href="/cart">
            <FaShoppingCart className="text-xl cursor-pointer hover:text-dusty" />
          </Link>
        </div>
      </div>

      {/* Menu Navbar */}
      <div className="border-t bg-white">
        <ul className="flex justify-center gap-10 py-4 uppercase text-sm font-semibold tracking-wider">
          <li className="relative group cursor-pointer">
            <button onClick={handleHomeClick} className="hover:text-dusty">
              HOME
            </button>
            <div className="absolute w-full h-1 bg-dusty scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </li>
          {[{ name: "Flowers", link: "/collection" }, { name: "Plants", link: "/tanaman" }, { name: "Accessories", link: "/aksesoris" }, { name: "Décor", link: "/dekor" }, { name: "Bouquet", link: "/bouquet" }, { name: "Custom Order", link: "/custom" }].map((item, index) => (
            <li key={index} className="relative group cursor-pointer">
              <Link href={item.link} className="hover:text-dusty">
                {item.name}
              </Link>
              <div className="absolute w-full h-1 bg-dusty scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </li>
          ))}
        </ul>
      </div>

      {/* Hasil Pencarian */}
      {products.length > 0 && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md p-4 z-50">
          <ul>
            {products.map((product) => (
              <li key={product.id_produk} className="py-2">
                <Link href={`/produk/${product.id_produk}`} className="hover:text-dusty">
                  {product.nama_produk}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
