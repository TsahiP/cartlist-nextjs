"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ item, mobile = false, onClick }) => {
  const pathName = usePathname();
  const isActive = pathName === item.path;
  const Icon = item.icon;

  const handleClick = () => {
    if (onClick) onClick();
  };

  if (mobile) {
    return (
      <Link
        href={item.path}
        onClick={handleClick}
        className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group border border-transparent min-h-[48px] `}
          // ${
        //   isActive 
        //     ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-gradient-to-r from border-blue-200' 
        //     : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1 hover:border-gray-200 hover:shadow-md'
        // }`
      
    
      >
        {Icon && (
          <Icon 
            size={20} 
            className={`transition-all duration-300 ${
              isActive 
                ? 'text-white' 
                : 'text-gray-600 group-hover:text-blue-600 group-hover:scale-110'
            }`} 
          />
        )}
        <span className={`font-medium transition-all duration-300 ${
          isActive 
            ? 'text-white' 
            : 'text-gray-700 group-hover:text-gray-900'
        }`}>
          {item.title}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={item.path}
      className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group border border-transparent overflow-hidden `}


    >
      {Icon && (
        <Icon 
          size={18} 
          className={`transition-all duration-300 ${
            isActive 
              ? 'text-white' 
              : 'text-gray-600 group-hover:text-blue-600 group-hover:scale-110'
          }`} 
        />
      )}
      <span className={`font-medium text-sm transition-all duration-300 ${
        isActive 
          ? 'text-white' 
          : 'text-gray-700 group-hover:text-gray-900'
      }`}>
        {item.title}
      </span>
      
      {/* Desktop active indicator with glow effect */}
      {isActive && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg animate-pulse opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-90" />
        </>
      )}
      
      {/* Hover shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </Link>
  );
};

export default NavLink;