"use client";
import { useState, useEffect, useRef } from "react";
import NavLink from "./navLink/NavLink";
import { handleGithubSignOut } from "@/lib/actions";
import { HiMenu, HiX } from "react-icons/hi";
import { IoLogOut, IoCart, IoList, IoAdd, IoHome } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Links = ({ session }) => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const user = session?.user;

  // Navigation items for authenticated users
  const navigationItems = [
    { title: "רשימות", path: "/carts", icon: IoList },
    { title: "עגלה", path: "/cart", icon: IoCart },
    { title: "רשימה חדשה", path: "/createList", icon: IoAdd },
  ];

  const toggleMenu = () => {
    setOpen(!open);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogOut = () => {
    setOpen(false);
    handleGithubSignOut();
  };

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      {session && (
        <div className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
          
          {/* Desktop User Menu */}
          <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={user?.image !== "" ? user?.image : "/noavatar.png"}
              />
              <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {user?.name ? (user.name[0] + (user.name[1] || '')).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 hidden lg:block">
              {user?.name?.split(' ')[0]}
            </span>
            <Button
              onClick={handleLogOut}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <IoLogOut size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMenu} 
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-700 border-none bg-transparent cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Toggle menu"
      >
        {open ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />
      )}

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 h-screen w-72 sm:w-64 bg-white/95 backdrop-blur-xl border-l border-gray-200/80 p-6 z-50 shadow-2xl transition-all duration-500 ease-out md:hidden ${
          open 
            ? 'right-0 opacity-100 translate-x-0' 
            : '-right-full opacity-0 translate-x-full'
        }`}
      >
        {session ? (
          <div className="flex flex-col h-full">
            {/* User Profile Section */}
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-6 border border-blue-100">
              <Avatar className="w-12 h-12 ring-2 ring-blue-200">
                <AvatarImage
                  src={user?.image !== "" ? user?.image : "/noavatar.png"}
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                  {user?.name ? (user.name[0] + (user.name[1] || '')).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-2">
              {navigationItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  item={item} 
                  mobile 
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>

            {/* Logout Button */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <Button
                onClick={handleLogOut}
                variant="destructive"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <IoLogOut size={18} />
                <span>התנתק</span>
              </Button>
            </div>
          </div>
        ) : (
          // Guest menu (if needed)
          <div className="flex flex-col space-y-4">
            <NavLink 
              item={{ title: "התחבר", path: "/login", icon: IoHome }} 
              mobile 
              onClick={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
