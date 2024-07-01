import Link from "next/link";
// import Links from "./links/Links";
import styles from "./navbar.module.css";
// import { auth } from "@/lib/auth";
const Navbar = async () => {
  // const session = await auth();
  const session = "dd"

  // console.log(session);
  return (
    <div className={styles.container}>
            {/* <Link href={"http://localhost:3000/"} className={styles.logo}>Logo</Link> */}

      <Link href={"http://localhost:3000/"} className={styles.logo}>Logo</Link>
      <div>
        {/* <Links session={session} /> */}
      </div>
    </div>
  );
};

export default Navbar;
