import Link from "next/link";
import Links from "./links/Links";
import styles from "./navbar.module.css";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { CgMenu } from "react-icons/cg";
const Navbar = async () => {
  const session = await auth();

  // console.log(session);
  return (
    <div className={styles.container}>
            {/* <Link href={"http://localhost:3000/"} className={styles.logo}>Logo</Link> */}

      <Link href={process.env.BASE_URL} className={styles.logo}><Image alt="blat" src={"/logo.svg"} width={75} height={75} /></Link>
      <div>
        <Links session={session} />
      </div>
    </div>
  );
};

export default Navbar;
