import Image from "next/image";
import { FaCogs, FaClock, FaGlobe, FaShippingFast } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-nude px-6 lg:px-20 py-6 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Promo Image */}
        <div className="relative w-full h-80 lg:h-96">
          <Image
            src="/dekor/dekor1.jpeg"
            alt="Eid in Full Bloom"
            layout="fill"
            objectFit="cover"
            className="rounded-none pt-20"
          />
        </div>

        {/* Shop Description */}
        <div className="text-center lg:text-left pt-20">
          <h1 className="text-2xl font-bold uppercase">Bandung Flower Shop</h1>
          <p className="text-gray-700 mt-3">
            No. 1 Florist in Bandung with 100+ Flower Variants
          </p>
          <p className="text-gray-700 mt-1">
            Free Regular & Same-Day* Delivery Across Bandung Area
          </p>
          <p className="text-sm text-gray-500 mt-2">
            *for orders before 3:00 PM (GMT+7)
          </p>
        </div>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { name: "Personalized Services", icon: <FaCogs />, desc: "Order flowers tailored to your needs with unique designs." },
          { name: "On-Time Delivery", icon: <FaClock />, desc: "Reliable and always on-time delivery service." },
          { name: "Wide Coverage", icon: <FaGlobe />, desc: "Our services cover multiple cities and regions." },
          { name: "Free In-City Delivery", icon: <FaShippingFast />, desc: "Enjoy free delivery for local city areas." },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-white p-6 rounded-none shadow-md text-center min-h-[180px]"
          >
            <div className="text-4xl text-red-400 mb-2">{item.icon}</div>
            <h2 className="text-md font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
