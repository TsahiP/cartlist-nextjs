"use client";
import { useState, useEffect, useRef } from "react";
import { handleGithubSignOut } from "@/lib/actions";
import { CgMenu, CgClose } from "react-icons/cg";
import { IoEnter } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Links = ({ session }) => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const user = session?.user;

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
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleLogOut = () => {
    handleGithubSignOut();
    setOpen(false);
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Carts", href: "/carts" },
    { name: "Create List", href: "/createList" },
    { name: "Settings", href: "#" },
  ];

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 relative overflow-hidden"
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <CgMenu 
            size={24} 
            className={`absolute inset-0 transition-all duration-300 ease-in-out ${
              open ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <CgClose 
            size={24} 
            className={`absolute inset-0 transition-all duration-300 ease-in-out ${
              open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-75'
            }`}
          />
        </div>
      </Button>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ease-in-out ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden transition-all duration-300 ease-in-out transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
            >
              <CgClose size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {session ? (
              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-blue-100 dark:border-gray-600">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-200 dark:ring-gray-600">
                    <AvatarImage
                      src={user?.image !== "" ? user?.image : "/noavatar.png"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {user?.name ? (user.name[0] + (user.name[1] || '')).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Button 
                      key={item.name}
                      variant="ghost" 
                      className="w-full justify-start text-left hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200"
                      onClick={() => setOpen(false)}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: open ? 'slideInFromRight 300ms ease-out forwards' : 'none'
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Welcome! Please sign in to continue.</p>
                  <Button className="w-full" onClick={() => setOpen(false)}>
                    Sign In
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {session && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="destructive"
                className="w-full gap-2 hover:bg-red-600 transition-colors duration-200"
                onClick={handleLogOut}
              >
                <IoEnter size={20} />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop user menu */}
      <div className="hidden md:flex items-center space-x-4">
        {session ? (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-2 ring-blue-200 dark:ring-gray-600 transition-all duration-200 hover:ring-blue-300">
              <AvatarImage
                src={user?.image !== "" ? user?.image : "/noavatar.png"}
                alt={user?.name || "User"}
              />
              <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {user?.name ? (user.name[0] + (user.name[1] || '')).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              {user?.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogOut}
              className="gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
            >
              <IoEnter size={16} />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
            Sign In
          </Button>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Links;
