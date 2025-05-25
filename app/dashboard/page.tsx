'use client';

import { useState } from 'react';
import { FaTachometerAlt, FaChartLine, FaMoneyBillWave, FaLayerGroup } from 'react-icons/fa';

const SidebarItem = ({ title, icon: Icon, submenus }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="relative transition">
      <div
        className="relative m-2 flex items-center rounded-xl border-b-4 border-gray-300 bg-gray-50 py-3 pl-5 text-sm text-gray-500 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-5 flex w-5 text-gray-500">
          <Icon size={20} />
        </span>
        {title}
      </div>
      {submenus && (
        <ul
          className={`duration-400 m-2 flex flex-col overflow-hidden rounded-2xl bg-gray-100 transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        >
          {submenus.map((submenu, index) => (
            <li
              key={index}
              className="m-2 flex cursor-pointer rounded-xl py-3 pl-5 text-sm text-gray-500 hover:bg-white"
            >
              <span className="mr-5">
                <submenu.icon size={18} />
              </span>
              {submenu.title}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default function AdminPage() {
  return (
    <div className="h-screen flex">
      <div className="my-4 h-5/6 w-72 flex-col rounded-tr-2xl rounded-br-2xl bg-gray-200">
        <ul className="mt-12 flex flex-col">
          <SidebarItem title="Dashboard" icon={FaTachometerAlt} submenus={[{ title: 'Carnival', icon: FaLayerGroup }, { title: 'Analytics', icon: FaChartLine }, { title: 'Revenue', icon: FaMoneyBillWave }]} />
          <SidebarItem title="Analytics" icon={FaChartLine} submenus={[{ title: 'Carnival', icon: FaLayerGroup }, { title: 'Analytics', icon: FaChartLine }, { title: 'Revenue', icon: FaMoneyBillWave }]} />
        </ul>
      </div>
      <div className="flex-1 p-10">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>
    </div>
  );
}
