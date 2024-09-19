import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-orange-100 min-h-screen min-w-full">
      <Navbar />
      {children}
    </div>
  );
}
