"use client";

import { usePathname } from "next/navigation";
import SideNav from "./sidenav";

const hiddenPaths = ["/groups/create-group", "/groups/[id]/create-check"];

export default function SideNavWrapper() {
  const pathname = usePathname();

  if (hiddenPaths.includes(pathname)) {
    return <SideNav hidden={true} />;
  }

  return <SideNav />;
}
