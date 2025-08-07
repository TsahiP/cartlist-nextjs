"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getUserInitials = (name) => {
  if (!name || typeof name !== "string") return "U";
  const trimmed = name.trim();
  if (trimmed.length === 0) return "U";
  const first = trimmed[0] || "";
  const second = trimmed[1] || "";
  return (first + second).toUpperCase();
};

const UserAvatar = ({ user, className = "" }) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={user?.image !== "" ? user?.image : "/noavatar.png"} />
      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
        {getUserInitials(user?.name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

