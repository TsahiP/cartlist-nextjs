"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getUserInitials = (name) => {
  if (!name || typeof name !== "string") return "U";
  const trimmed = name.trim();
  if (trimmed.length === 0) return "U";
  const words = trimmed.split(" ");
  const first = words[0]?.[0] || "";
  const second = words[1]?.[0] || "";
  console.log("🚀 ~ getUserInitials ~ first + second:", first + second)
  return (first + second).toUpperCase();
};

const UserAvatar = ({ user, className = "" }) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={user?.image !== "" ? user?.image : "/noavatar.png"} />
      <AvatarFallback className="bg-gradient-to-r to-purple-800 text-white font-semibold">
        {getUserInitials(user?.name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

