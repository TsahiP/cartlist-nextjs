"use client";
import styles from "./links.module.css";
import NavLink from "./navLink/NavLink";
import "./links.module.css";
import { useState } from "react";
import { handleGithubSignOut } from "@/lib/actions";
import { CgMenu } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { IoEnter } from "react-icons/io5";
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
  // console.log(session?.user);
  return (
    <div className={styles.container}>
      <div className={styles.links}>
        {/* {links.map((link) => (
          <NavLink key={link.title} item={link} />
        ))} */}

        {session ? (
          <>
            {session.user?.isAdmin && <NavLink item={{ title: "admin", path: "/admin" }} />}
            <form action={handleGithubSignOut} >
              <Button >Logout <IoEnter /></Button>
            </form>
          </>
        ) : (
          <NavLink item={{ title: "Login", path: "/login" }} />
        )}
      </div>

    </div>
  );
};

export default Links;
