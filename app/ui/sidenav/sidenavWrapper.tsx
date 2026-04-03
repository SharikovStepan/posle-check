"use client";

import { usePathname } from "next/navigation";
import SideNav from "./sidenav";

const hiddenPaths = ["/groups/create-group", "/groups/[id]/create-check"];

export default function SideNavWrapper() {
  const pathname = usePathname();

  const isCreateCheckPath = pathname?.endsWith("/create-check");
  const isHiddenPath = hiddenPaths.includes(pathname);

  if (isHiddenPath || isCreateCheckPath) {
    return <SideNav hidden={true} />;
  }

  return <SideNav />;
}
