"use client";
import { useState, useEffect } from "react";

const NavbarWrapper = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-md border-gray-200/30 dark:border-gray-700/30'
      }`}
    >
      {children}
    </nav>
  );
};

export default NavbarWrapper; 