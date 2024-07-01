import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center flex flex-col justify-center">
      <div className=" flex  gap-5 justify-center">
        <div>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
        <div>
        <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
