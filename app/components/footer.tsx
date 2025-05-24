import Link from "next/link";
import { FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white px-6 lg:px-20 py-10 border-t">
      <div className="text-gray-900">
        {/* Brand */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl font-semibold">turbopetals</h2>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {/* Links */}
          <div className="w-full">
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              {[
                "Our Story",
                "FAQ",
                "Contact Us",
                "Refund Policy",
                "Terms & Conditions",
              ].map((item, index) => (
                <li key={index}>
                  <Link href="/about" className="hover:text-dusty">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="w-full">
            <h3 className="font-semibold mb-4">Social</h3>
            <p>Stay current with updates from our social channels.</p>
            <p className="mt-2">
              Or contact us directly at{" "}
              <a href="https://wa.me/62882001865870" className="underline flex items-center gap-2 hover:text-dusty">
                <FaPhone /> +62 238-487-483
              </a>{" "}
              (WA chat/order)
            </p>
            <div className="mt-4 flex gap-4">
              <a href="https://www.instagram.com/karismaanjani_/" className="text-2xl text-gray-700 hover:text-dusty">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full">
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div className="flex mt-4">
              <input
                type="email"
                placeholder="email@newsletter.com"
                className="border border-gray-300 px-3 py-2 w-full"
              />
              <button className="bg-black text-white px-4 hover:bg-dusty">JOIN</button>
            </div>
          </div>

          {/* Customer Care */}
          <div className="w-full">
            <h3 className="font-semibold mb-4">Customer Care</h3>
            <p className="flex items-center gap-2 hover:text-dusty">
              <FaPhone /> Call
            </p>
            <p className="font-bold hover:text-dusty">+62 238-487-483</p>
            <p className="mt-2 flex items-center gap-2 hover:text-dusty">
              <FaEnvelope /> Email
            </p>
            <p className="font-bold hover:text-dusty">admin@turbopetals.com</p>
            <p className="mt-2 flex items-center gap-2 hover:text-dusty">
              <FaPhone /> WhatsApp (Dirjen Perlindungan Konsumen)
            </p>
            <p className="font-bold hover:text-dusty">+62 238-487-483</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
