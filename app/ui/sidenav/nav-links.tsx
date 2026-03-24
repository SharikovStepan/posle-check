"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        <Link
          key={link.href}
          href={link.href}
          className={`border-2 rounded-md border-light-green-500 text-light-green-500 w-full h-10 flex justify-center items-center hover:bg-indigo-velvet-700 ${
            pathname == link.href ? "bg-indigo-velvet-800 hover:bg-indigo-velvet-800 pointer-events-none" : ""
          }`}>
          <p className="">{link.name}</p>
        </Link>
      ))}
    </nav>
  );
}
