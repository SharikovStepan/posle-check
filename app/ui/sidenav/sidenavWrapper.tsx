"use client";

import { usePathname } from "next/navigation";
import SideNav from "./sidenav";
import Link from "next/link";
import { motion } from "motion/react";

const hiddenPaths = ["/groups/create-group", "/", "/login"];

export default function SideNavWrapper() {
  const pathname = usePathname();

  const isCreateCheckPath = pathname?.endsWith("/create-check");
  const isHiddenPath = hiddenPaths.includes(pathname);
  return (
    <>
      <motion.div layoutScroll className="fixed z-50 md:static bottom-0 md:bottom-auto md:left-auto left-0 w-full md:w-auto md:grid md:grid-rows-[100_auto] gap-3 md:col-[1/2]">
        <Link href={"/"}>
          <h1 className="hidden p-4 h-(--header-height) rounded-md text-4xl md:flex justify-center items-center bg-accent text-primary shadow-sm border border-border">ПослеЧек</h1>
        </Link>
        <SideNav hidden={isCreateCheckPath || isHiddenPath ? true : false} />
      </motion.div>
    </>
  );
}
