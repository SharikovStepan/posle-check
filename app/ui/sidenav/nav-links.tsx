"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const links = [
  { name: "Друзья", href: "/friends" },
  { name: "Группы", href: "/groups" },
  { name: "Чеки", href: "/checks" },
  { name: "Профиль", href: "/profile" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row md:flex-col justify-center items-center gap-3">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={`block w-full z-0 ${pathname == link.href ? "pointer-events-none" : ""}`}>
          <motion.div
            whileTap={{ backgroundColor: "var(--color-bg-primary)", scale: 0.95 }}
            whileHover={{ backgroundColor: "var(--color-bg-primary)" }}
            className={`z-40 relative w-full h-10 flex justify-center items-center rounded-4xl`}>
            {pathname == link.href && <motion.div layoutId="nav-button-bg" className="rounded-4xl absolute h-full w-full bg-accent z-0 pointer-events-none" />}
            <p className={`${pathname == link.href ? "text-text-inverted" : "text-text-primary"} will-change-transform transition-colors duration-500 z-50`}>{link.name}</p>
          </motion.div>
        </Link>
      ))}
    </nav>
  );
}
