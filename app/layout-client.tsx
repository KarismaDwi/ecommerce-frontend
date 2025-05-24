// app/layout.tsx (Server-side layout)
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

export const metadata = {
  title: "Florist",
  description: "Flower Shop",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <Headers />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
