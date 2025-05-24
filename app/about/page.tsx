import Image from 'next/image';
import { FaMapMarkerAlt, FaTruck, FaStore } from 'react-icons/fa';

export default function About() {
  return (
    <div className="bg-nude text-dusty min-h-screen py-10 px-6 md:px-20 font-[--font-geist-sans] pt-40">
      <div className="max-w-4xl mx-auto text-center border-b border-gray-400 pb-6">
        <h1 className="text-6xl font-extrabold text-dusty mb-4 uppercase tracking-wide">Turbo Petals Gazette</h1>
        <h2 className="text-3xl font-semibold text-gray-600 mb-2">Bringing Fresh Blooms to Your Special Moments</h2>
        <p className="text-lg text-gray-600 italic">Turbo Petals brings beauty and freshness with high-quality flowers.</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mt-10">
        <div className="col-span-2 text-justify leading-relaxed">
          <h2 className="text-2xl font-bold text-gray-600 border-b border-gray-400 pb-2 mb-4">Our Vision</h2>
          <p className="text-gray-600 mb-6">
            To be the best flower shop that spreads happiness and warmth through every bouquet we create.
          </p>
          <h2 className="text-2xl font-bold text-gray-600 border-b border-gray-400 pb-2 mb-4">Our Mission</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Providing the freshest and highest quality flowers.</li>
            <li>Serving customers with dedication and hospitality.</li>
            <li>Creating unique and innovative floral arrangements.</li>
            <li>Supporting sustainability through eco-friendly processes.</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Image 
            src="/flowers.jpg" 
            alt="Fresh flowers from Turbo Petals" 
            width={400} 
            height={300} 
            className="border-2 border-gray-400 shadow-md"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center mt-10 border-t border-gray-400 pt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Visit Our Store</h2>
        <p className="text-gray-800 flex justify-center items-center gap-2">
          <FaMapMarkerAlt className="text-red-500 text-xl" /> Los Santos, Vinewood Boulevard, No. 24 (Near Ross Bakery)
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Our Services</h3>
        <p className="text-gray-800 flex justify-center items-center gap-2 mt-2">
          <FaStore className="text-green-500 text-xl" /> In-store Pick-up Available
        </p>
        <p className="text-gray-800 flex justify-center items-center gap-2 mt-2">
          <FaTruck className="text-blue-500 text-xl" /> Home Delivery Service
        </p>
      </div>
    </div>
  );
}
