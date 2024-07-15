import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="text-foreground bg-background flex flex-col justify-center text-center">
      <div className="flex items-center flex-col justify-center">
        <h1 className="text-primary text-3xl md:text-4xl font-bold mb-6">
          List App
        </h1>
        <Image src="/logo.svg" alt="" width={200} height={200} />
      </div>
      {!session ? (
        <div className="flex gap-20 justify-center">
          <div>
            <Button asChild className="bg-accent text-card-foreground ">
              <Link href="/login" className="">
                Login
              </Link>
            </Button>
          </div>
          <div>
            <Button asChild className="bg-accent text-accent-foreground">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button asChild className="bg-accent text-accent-foreground">
            <Link href="/register">To Lists</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
