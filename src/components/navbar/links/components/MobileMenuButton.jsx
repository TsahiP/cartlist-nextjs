"use client";

import { HiMenu, HiX } from "react-icons/hi";

const MobileMenuButton = ({ open, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-700 border-none bg-transparent cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Toggle menu"
    >
      {open ? <HiX size={24} /> : <HiMenu size={24} />}
    </button>
  );
};

export default MobileMenuButton;

