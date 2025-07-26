import Link from "next/link";
import Links from "./links/Links";
import { auth } from "@/lib/auth";
import Image from "next/image";
import NavbarWrapper from "./NavbarWrapper";

const Navbar = async () => {
  const session = await auth();

  return (
    <NavbarWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href={process.env.BASE_URL || "/"} 
            className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105"
          >
            <div className="relative">
              <Image 
                alt="Logo" 
                src="/logo.svg" 
                width={40} 
                height={40} 
                className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-200 group-hover:rotate-12" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-600">
              CartList
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center">
            <Links session={session} />
          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
};

export default Navbar;
