"use client";
import { useState, useEffect, useRef } from "react";
import NavLink from "./navLink/NavLink";
import { handleGithubSignOut } from "@/lib/actions";
import DesktopUserMenu from "./components/DesktopUserMenu";
import MobileMenuButton from "./components/MobileMenuButton";
import MobileDrawer from "./components/MobileDrawer";
import { navigationItems } from "./navItems";

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
      {session && (
        <div className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}

          <DesktopUserMenu user={user} onLogout={handleLogOut} />
        </div>
      )}

      <MobileMenuButton open={open} onToggle={toggleMenu} />

      <MobileDrawer
        open={open}
        sidebarRef={sidebarRef}
        session={session}
        navigationItems={navigationItems}
        onClose={() => setOpen(false)}
        onLogout={handleLogOut}
      />
    </div>
  );
};

export default Links;
