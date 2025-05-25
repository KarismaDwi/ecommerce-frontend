'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiLogOut, FiChevronRight } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';

const menu = [
  { name: 'Dashboard', icon: '📊' },
  { name: 'Produk',    icon: '🌸' },
  { name: 'Pembeli',   icon: '🧑‍🤝‍🧑' },
  { name: 'Pesanan',   icon: '📦' },
  { name: 'Laporan',   icon: '📑' },
  { name: 'Custom',    icon: '🎨' },
  { name: 'Komplain',  icon: '❓' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [highlightStyle, setHighlightStyle] = useState({});
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = menu.findIndex(
      item => {
        const link = `/admin/${item.name.toLowerCase()}`;
        return pathname === link || pathname.startsWith(link + '/');
      }
    );
    if (activeIndex >= 0 && menuRefs.current[activeIndex]) {
      const el = menuRefs.current[activeIndex];
      const { offsetTop, offsetHeight } = el!;
      setHighlightStyle({
        top: offsetTop,
        height: offsetHeight,
        opacity: 1,
      });
    } else {
      setHighlightStyle({ opacity: 0 });
    }
  }, [pathname]);

  return (
    <aside className="w-64 bg-gradient-to-br from-pink-100 via-pink-200 to-yellow-100 border-r p-7 space-y-8 fixed min-h-screen shadow-2xl flex flex-col z-50">
      <h1 className="text-3xl font-extrabold text-tomat tracking-wider mb-6 select-none drop-shadow flex items-center gap-2">
        <span className="inline-block animate-bounce text-4xl">A</span>
        <span className="ml-1">TMIN</span>
        <span className="ml-auto text-xs bg-white/60 px-3 py-1 rounded-full text-tomat font-bold tracking-widest shadow">ADMIN</span>
      </h1>
      <div className="relative flex-1">
        {/* Highlight */}
        <div
          className="absolute left-0 w-full bg-pink-50 text-tomat font-bold scale-105 border-l-4 border-pink-400 transition-all duration-300 ease-in-out pointer-events-none rounded-xl shadow"
          style={{
            ...highlightStyle,
            position: 'absolute',
            zIndex: 0,
            transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
            borderTopLeftRadius: '0.75rem',
            borderBottomLeftRadius: '0.75rem',
          }}
        />
        <nav className="flex flex-col space-y-1 relative z-10">
          {menu.map((item, idx) => {
            const link = `/admin/${item.name.toLowerCase()}`;
            const active =
              pathname &&
              (pathname === link || pathname.startsWith(link + '/'));
            return (
              <Link key={item.name} href={link} className="block group">
                <div
                  ref={el => menuRefs.current[idx] = el}
                  className={`
                    relative flex items-center gap-3 w-full px-5 py-3 rounded-xl cursor-pointer
                    text-gray-700 transition-all duration-200 font-semibold
                    ${
                      active
                        ? 'bg-gradient-to-r from-pink-300 via-yellow-100 to-pink-200 text-tomat font-extrabold scale-105 border-l-4 border-pink-500 shadow animate-pulse'
                        : 'hover:bg-white/70 hover:scale-105'
                    }
                  `}
                  style={{ zIndex: 2 }}
                >
                  <span className={`text-xl ${active ? 'drop-shadow-md scale-125' : ''}`}>{item.icon}</span>
                  <span className="flex-1 tracking-wide">{item.name}</span>
                  {active && (
                    <FiChevronRight className="text-pink-600 text-xl animate-slideRight" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        className="flex items-center gap-2 text-white bg-gradient-to-r from-red-500 to-pink-500 px-5 py-3 rounded-xl mt-8 mb-2 shadow-lg hover:scale-105 transition-all font-semibold tracking-wide"
      >
        <FiLogOut className="text-lg" />
        <span>Log out</span>
      </button>
      {/* Animasi untuk panah */}
      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(-8px); opacity: 0.7; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slideRight {
          animation: slideRight 0.5s ease;
        }
      `}</style>
    </aside>
  );
}