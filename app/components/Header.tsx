import Image from "next/image";
import { FaCogs, FaClock, FaGlobe, FaShippingFast } from "react-icons/fa";

const Header = () => {
  return (
    <header className="mt-16 bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 px-6 lg:px-20 py-12 pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Gambar Promo */}
        <div className="relative w-full h-72 lg:h-[420px] rounded-3xl shadow-xl overflow-hidden">
          <Image
            src="/dekor/dekor1.jpeg"
            alt="Lebaran Berbunga"
            layout="fill"
            objectFit="cover"
            className="rounded-3xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/0 to-white/0"></div>
        </div>
        <div className="text-center lg:text-left pt-0 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-4 drop-shadow tracking-wide leading-tight">
            Toko Bunga Bandung
          </h1>
          <p className="text-lg text-gray-700 font-medium mb-2">
            Florist <span className="text-pink-500 font-bold">No. 1</span> di Bandung dengan <span className="text-yellow-500 font-bold">100+</span> Varian Bunga
          </p>
          <p className="text-lg text-gray-700 font-medium mb-1">
            Pengiriman <span className="text-green-500 font-bold">Reguler & Hari yang Sama*</span> Gratis di Area Bandung
          </p>
          <p className="text-sm text-gray-400 mt-2 italic">
            *untuk pemesanan sebelum jam 20.00 WIB
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {[
          {
            name: "Layanan Kustom",
            icon: <FaCogs />,
            desc: "Pesan bunga sesuai kebutuhanmu dengan desain unik.",
            color: "from-pink-100 to-pink-50"
          },
          {
            name: "Pengiriman Tepat Waktu",
            icon: <FaClock />,
            desc: "Layanan pengiriman yang andal dan selalu tepat waktu.",
            color: "from-yellow-100 to-yellow-50"
          },
          {
            name: "Jangkauan Luas",
            icon: <FaGlobe />,
            desc: "Layanan kami mencakup berbagai kota dan wilayah.",
            color: "from-blue-100 to-blue-50"
          },
          {
            name: "Gratis Ongkir Dalam Kota",
            icon: <FaShippingFast />,
            desc: "Nikmati pengiriman gratis untuk area dalam kota.",
            color: "from-green-100 to-green-50"
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center bg-gradient-to-b ${item.color} p-6 rounded-2xl shadow-xl text-center min-h-[180px] border-t-4 border-pink-200 hover:scale-105 transition`}
          >
            <div className="text-5xl mb-3 text-pink-400 drop-shadow">{item.icon}</div>
            <h2 className="text-lg font-bold text-pink-700 mb-1">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;