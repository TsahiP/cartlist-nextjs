"use client";

import { Button } from "@/components/ui/button";
import { IoLogOut, IoHome } from "react-icons/io5";
import UserAvatar from "./UserAvatar";
import NavLink from "../navLink/NavLink";

const MobileDrawer = ({ open, sidebarRef, session, navigationItems, onClose, onLogout }) => {
  const user = session?.user;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />}

      <div
        ref={sidebarRef}
        className={` top-0 h-screen w-72 sm:w-64 bg-white/95 backdrop-blur-xl border-l border-gray-200/80 p-6  shadow-2xl transition-all duration-500 ease-out md:hidden ${
          open ? "right-0 opacity-100 translate-x-0 z-50 fixed" : "-right-full opacity-0 translate-x-full z-0 hidden"
        }`}
      >
        {session ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-6 border border-blue-100">
              <UserAvatar user={user} className="w-12 h-12 ring-2 ring-blue-200" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              {navigationItems.map((item) => (
                <NavLink key={item.path} item={item} mobile onClick={onClose} />
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-200">
              <Button
                onClick={onLogout}
                variant="destructive"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <IoLogOut size={18} />
                <span>התנתק</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <NavLink item={{ title: "התחבר", path: "/login", icon: IoHome }} mobile onClick={onClose} />
          </div>
        )}
      </div>
    </>
  );
};

export default MobileDrawer;

