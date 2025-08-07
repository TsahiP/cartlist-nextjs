"use client";

import { Button } from "@/components/ui/button";
import { IoLogOut } from "react-icons/io5";
import UserAvatar from "./UserAvatar";

const DesktopUserMenu = ({ user, onLogout }) => {
  return (
    <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
      <UserAvatar user={user} className="w-8 h-8" />
      <span className="text-sm font-medium text-gray-700 hidden lg:block">
        {user?.name?.split(" ")[0]}
      </span>
      <Button
        onClick={onLogout}
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
      >
        <IoLogOut size={18} />
      </Button>
    </div>
  );
};

export default DesktopUserMenu;

