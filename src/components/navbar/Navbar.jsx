import Link from "next/link";
import Links from "./links/Links";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { CgMenu } from "react-icons/cg";
const Navbar = async () => {
  const session = await auth();

  // console.log(session);
  return (
    
    <div className='bg-inherit h-[100px] flex items-center justify-between '>
      <Link href={process.env.BASE_URL} className={'text-3xl font-bold'}><Image alt="blat" src={"/logo.svg"} width={75} height={75} /></Link>
      <div>
        <Links session={session} />
      </div>
    </div>
  );
};

export default Navbar;
