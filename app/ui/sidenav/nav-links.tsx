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
          className={`w-full h-10 flex justify-center items-center transition-all duration-200 ${
            pathname == link.href ? "bg-accent text-text-inverted pointer-events-none shadow-sm" : "bg-surface text-foreground hover:bg-surface-hover hover:shadow-sm"
          } rounded-4xl`}>
          <p>{link.name}</p>
        </Link>
      ))}
    </nav>
  );
}
