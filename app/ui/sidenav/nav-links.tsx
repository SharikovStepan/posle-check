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
      className={`border-2 rounded-md border-border w-full h-10 flex justify-center items-center transition-all duration-200 ${
        pathname == link.href
          ? "bg-primary text-primary-foreground hover:bg-primary pointer-events-none shadow-sm"
          : "bg-surface text-foreground hover:bg-surface-strong hover:shadow-sm"
      }`}>
      <p>{link.name}</p>
    </Link>
  ))}
</nav>
  );
}
