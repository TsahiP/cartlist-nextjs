"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./links.module.css";
import NavLink from "./navLink/NavLink";
import { handleGithubSignOut } from "@/lib/actions";
import { CgMenu } from "react-icons/cg";
import { IoEnter } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { IoMdListBox } from "react-icons/io";

const Links = ({ session }) => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null); // שימוש ב-ref לתפריט הצד
  const user = session?.user;

  const links = [
    { title: "Homepage", path: "/" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
    { title: "Blog", path: "/blog" },
  ];

  const toggleMenu = () => {
    setOpen(!open);
  };

  // הוספת מאזין קליקים לסגירת התפריט כאשר לוחצים מחוץ לתפריט
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false); // סגור את התפריט אם לוחצים מחוץ לתפריט
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  const handleLogOut = () => {
    handleGithubSignOut();
  };
  return (
    <div className={styles.container}>
      {/* כפתור המבורגר */}
      <button onClick={toggleMenu} className={styles.hamburger}>
        <CgMenu size={30} />
      </button>

      {/* תפריט צד שנפתח */}
      <div
        ref={sidebarRef} // הוספת ref לתפריט הצד
        className={`${styles.sidebar} ${open ? styles.open : ""}`}
      >
        {/* {links.map((link) => (
          <NavLink key={link.path} item={link} />
        ))} */}

        {/* כפתור יציאה במידה והמשתמש מחובר */}
        {session && (
          <div className="gap-4 flex flex-col">
            <div className="flex flex-col md:flex-row items-center justify-between  p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={user.image !== "" ? user.image : "/noAvatar.png"}
                  />
                  <AvatarFallback>
                    {(user.name[0] + user.name[1]).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <hr className="text-center my-2 border-gray-300 w-full" />
            
              <Button className="text-white  gap-2" onClick={handleLogOut}>
                התנתק <IoEnter size={20} />
              </Button>
              

              
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;

// "use client";
// import styles from "./links.module.css";
// import NavLink from "./navLink/NavLink";
// import "./links.module.css";
// import { useState } from "react";
// import { handleGithubSignOut } from "@/lib/actions";
// import { CgMenu } from "react-icons/cg";
// import { Button } from "@/components/ui/button";
// import { IoEnter } from "react-icons/io5";
// const Links = ({session}) => {
//   const [open, setOpen] = useState(false);
//   const links = [
//     {
//       title: "Homepage",
//       path: "/",
//     },
//     {
//       title: "About",
//       path: "/about",
//     },
//     {
//       title: "Contact",
//       path: "/contact",
//     },
//     {
//       title: "Blog",
//       path: "/blog",
//     },
//   ];

//   const isAdmin = true;
//   return (
//     <div className={styles.container}>
//       <div className={styles.links}>
//         {session ? (
//           <>
//             {session.user?.isAdmin && <NavLink item={{ title: "admin", path: "/admin" }} />}
//             <form action={handleGithubSignOut} >
//               <Button >Logout <IoEnter size={20} /></Button>
//             </form>
//           </>
//         ) : (
//           <NavLink item={{ title: "Login", path: "/login" }} />
//         )}
//       </div>

//     </div>
//   );
// };

// export default Links;
