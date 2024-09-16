import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import Login from "./(auth)/login/page";

export default async function Home() {
  const session = await auth();
  return (
    <><Login/></>

    // <div className="text-foreground bg-background  flex flex-col justify-center text-center">
    //   <div className="flex items-center flex-col justify-center">
    //     {/* <h1 className="text-primary text-3xl md:text-4xl font-bold mb-6">

    //     </h1> */}
    //     <Image src="/logo.svg" alt="" width={200} height={200} />
    //   </div>
    //   {!session ?
    //     <div className="flex gap-20 justify-center">
    //       <div>
    //         <Button asChild className="bg-primary  text-card-foreground shadow-md">
    //           <Link href="/login" className="text-white">
    //             Login
    //           </Link>
    //         </Button>
    //       </div>
    //       <div>
    //         <Button asChild className="bg-accent text-accent-foreground shadow-md">
    //           <Link href="/register">Register</Link>
    //         </Button>
    //       </div>
    //     </div>

    //   :
    //     <div className="flex justify-center items-center flex-col ">
    //       <Button asChild className="bg-accent text-accent-foreground w-20 shadow-md">
    //         <Link href="/carts">לרשימות</Link>
    //       </Button>

    //     </div>

    //   }
    // </div>
  );
}
