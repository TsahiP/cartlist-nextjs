import Link from "next/link";
import Links from "./links/Links";
import { auth } from "@/lib/auth";
import Image from "next/image";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href={process.env.BASE_URL || "/"} 
            className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105"
          >
            <div className="relative">
              <Image 
                alt="CartList Logo" 
                src="/logo.svg" 
                width={40} 
                height={40} 
                className="md:w-12 md:h-12 transition-transform duration-200 group-hover:rotate-12"
              />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
              CartList
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center">
            <Links session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
