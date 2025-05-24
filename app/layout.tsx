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

  // Halaman yang TIDAK ada semua layout (Navbar, Header, Footer)
  const noLayoutPages = ['/checkout', '/register', '/login', '/payment', '/profile', '/dashboard'];

  const shouldHideAllLayout = noLayoutPages.includes(pathname);
  const shouldHideHeader = pathname === '/cart'; // Hanya hide Header kalau di /cart

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Navbar selalu tampil kalau bukan halaman no-layout */}
        {!shouldHideAllLayout && <Navbar />}
        
        {/* Header tampil kalau bukan halaman no-layout DAN bukan /cart */}
        {!shouldHideAllLayout && !shouldHideHeader && <Headers />}
        
        <main className="flex-grow">{children}</main>
        
        {/* Footer selalu tampil kalau bukan halaman no-layout */}
        {!shouldHideAllLayout && <Footer />}
      </body>
    </html>
  );
}
