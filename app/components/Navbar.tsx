"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaInstagram,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaTimes,
  FaBars,
} from "react-icons/fa";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(searchText)}`);
      setSearchText("");
      setIsMobileMenuOpen(false);
    }
  };

  const clearSearch = () => setSearchText("");

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <FaInstagram className="text-2xl cursor-pointer" />
          <h1 className="text-2xl font-bold tracking-wide">turbopetals</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <form onSubmit={handleSearchSubmit}>
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Cari"
                className="w-40 sm:w-60 md:w-72 lg:w-80 px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <FaTimes />
                </button>
              )}
            </form>
          </div>

          <Link href={isAuthenticated ? "/profile" : "/login"}>
            <FaUser className="text-xl cursor-pointer hover:text-dusty" />
          </Link>
          <Link href="/cart">
            <FaShoppingCart className="text-xl cursor-pointer hover:text-dusty" />
          </Link>

          {/* Hamburger */}
          <button
            className="sm:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Bottom Navbar (desktop) */}
      <div className="hidden sm:flex border-t bg-white justify-center gap-10 py-4 uppercase text-sm font-semibold tracking-wider">
        <Link href="/" className="hover:text-dusty relative group">
          BERANDA
          <div className="absolute w-full h-1 bg-dusty scale-x-0 group-hover:scale-x-100 transition-transform" />
        </Link>
        {[
          { name: "Papan Ucapan", link: "/collection" },
          { name: "Tanaman", link: "/tanaman" },
          { name: "Aksesoris", link: "/aksesoris" },
          { name: "Dékor", link: "/dekor" },
          { name: "Bouquet", link: "/bouquet" },
          { name: "Custom Order", link: "/custom" },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="hover:text-dusty relative group"
          >
            {item.name}
            <div className="absolute w-full h-1 bg-dusty scale-x-0 group-hover:scale-x-100 transition-transform" />
          </Link>
        ))}
      </div>

      {/* Bottom Navbar (mobile) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t bg-white px-6 py-4 space-y-3 text-sm uppercase font-semibold tracking-wide">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari"
              className="w-full px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <FaTimes />
              </button>
            )}
          </form>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            BERANDA
          </Link>
          {[
            { name: "Bunga", link: "/collection" },
            { name: "Tanaman", link: "/tanaman" },
            { name: "Aksesoris", link: "/aksesoris" },
            { name: "Dékor", link: "/dekor" },
            { name: "Bouquet", link: "/bouquet" },
            { name: "Custom Order", link: "/custom" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
