'use client';

import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";
import Navbar from "./components/Navbar";
import Headers from "./components/Header";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith('/admin');

  // Halaman tanpa layout sama sekali (Navbar, Header, Footer)
  const noLayoutPages = ['/register', '/login'];

  // Halaman tanpa Header (Navbar & Footer tetap)
  const noHeaderPages = [
    '/profile',
    '/collection',
    '/tanaman',
    '/dekor',
    '/aksesoris',
    '/bouquet',
    '/custom',
    '/search',
    '/checkout',
    '/payment',
    '/description',
    '/cart',
  ];

  // Halaman yang hanya hide Header & Footer tapi TAMPIL Navbar
  const hideHeaderFooterPages = ['/checkout', '/payment'];

  const shouldHideAll = noLayoutPages.includes(pathname) || isAdminPage;
  const shouldHideNavbar = shouldHideAll;
  const shouldHideHeaderFooter = hideHeaderFooterPages.some((path) =>
    pathname.startsWith(path)
  ) || isAdminPage;

  // Cek apakah header harus disembunyikan
  const shouldHideHeader =
    noHeaderPages.some((path) => pathname.startsWith(path)) ||
    noLayoutPages.includes(pathname) ||
    shouldHideHeaderFooter ||
    isAdminPage;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {!shouldHideNavbar && <Navbar />}
        {!shouldHideHeader && <Headers />}
        <main className="flex-grow">{children}</main>
        {!shouldHideHeaderFooter && !shouldHideAll && <Footer />}
      </body>
    </html>
  );
}
