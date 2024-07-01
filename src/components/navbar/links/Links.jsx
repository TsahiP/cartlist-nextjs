"use client";
import Link from "next/link";
import styles from "./links.module.css";
import NavLink from "./navLink/NavLink";
import "./links.module.css";
import { useState } from "react";
import Image from "next/image";
import { handleGithubSignOut } from "@/lib/actions";
const Links = ({session}) => {
  const [open, setOpen] = useState(false);
  const links = [
    {
      title: "Homepage",
      path: "/",
    },
    {
      title: "About",
      path: "/about",
    },
    {
      title: "Contact",
      path: "/contact",
    },
    {
      title: "Blog",
      path: "/blog",
    },
  ];

  const isAdmin = true;
  console.log(session?.user);
  return (
    <div className={styles.container}>
      <div className={styles.links}>
        {links.map((link) => (
          <NavLink key={link.title} item={link} />
        ))}

        {session ? (
          <>
            {session.user?.isAdmin && <NavLink item={{ title: "admin", path: "/admin" }} />}
            <form action={handleGithubSignOut} >
              <button className={styles.logout}>Logout</button>
            </form>
          </>
        ) : (
          <NavLink item={{ title: "Login", path: "/login" }} />
        )}
      </div>
      <div className={styles.menuButton}>
        <Image
          alt="menu"
          src="/menu.png"
          width={30}
          height={30}
          onClick={() => setOpen((prev) => !prev)}
        />
      </div>

      {open && (
        <div className={styles.mobileLinks}>
          {links.map((link) => (
            <NavLink key={link.title} item={link} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Links;
