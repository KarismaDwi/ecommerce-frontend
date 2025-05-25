import Link from "next/link";
import { FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white px-6 lg:px-20 py-10 border-t">
      <div className="text-gray-900">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl font-semibold">turbopetals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          <div className="w-full">
            <h3 className="font-semibold mb-4">Tautan</h3>
            <ul className="space-y-2">
              {[
                "Tentang Kami",
                "FAQ",
                "Hubungi Kami",
                "Kebijakan Refund",
                "Syarat & Ketentuan",
              ].map((item, index) => (
                <li key={index}>
                  <Link href="/about" className="hover:text-dusty">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full">
            <h3 className="font-semibold mb-4">Sosial Media</h3>
            <p>Ikuti kami di sosial media untuk update terbaru.</p>
            <p className="mt-2">
              Atau hubungi kami langsung melalui{" "}
              <a
                href="https://wa.me/62882001865870"
                className="underline flex items-center gap-2 hover:text-dusty"
              >
                <FaPhone /> +62 238-487-483
              </a>{" "}
              (Chat/Pesan WA)
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.instagram.com/karismaanjani_/"
                className="text-2xl text-gray-700 hover:text-dusty"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
          <div className="w-full">
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p>Berlangganan untuk promo spesial, giveaway, dan penawaran menarik lainnya.</p>
            <div className="flex mt-4">
              <input
                type="email"
                placeholder="email@newsletter.com"
                className="border border-gray-300 px-3 py-2 w-full"
              />
              <button className="bg-black text-white px-4 hover:bg-dusty">GABUNG</button>
            </div>
          </div>
          <div className="w-full">
            <h3 className="font-semibold mb-4">Layanan Pelanggan</h3>
            <p className="flex items-center gap-2 hover:text-dusty">
              <FaPhone /> Telepon
            </p>
            <p className="font-bold hover:text-dusty">+62 238-487-483</p>
            <p className="mt-2 flex items-center gap-2 hover:text-dusty">
              <FaEnvelope /> Email
            </p>
            <p className="font-bold hover:text-dusty">admin@turbopetals.com</p>
            <p className="mt-2 flex items-center gap-2 hover:text-dusty">
              <FaPhone /> WhatsApp (Dirjen Perlindungan Konsumen)
            </p>
            {/* Ubah bilah pengaduan menjadi link ke halaman komplain */}
            <Link href="/komplain" className="font-bold hover:text-dusty block mt-1">
              Bilah pengaduan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;