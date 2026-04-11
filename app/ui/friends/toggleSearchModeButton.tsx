"use client";

import { FriendsListTabs } from "@/app/lib/types/types.filters";
import { UserPlusIcon } from "@heroicons/react/16/solid";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

export default function ToggleSearchModeButton() {
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);

    const currentParam = params.get("filter");

    if (currentParam !== "search") {
      params.set("filter", "search");
    } else {
      params.set("filter", "friends");
    }

    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <ToggleButton currentTab={searchParams.get("filter")} onClick={handleClick} />
    </>
  );
}

export function ToggleButton({ currentTab, onClick }: { currentTab: string | null; onClick: () => void }) {
  return (
    <>
      <motion.button
        initial={false}
        whileHover={{ backgroundColor: "var(--color-accent-hover)", transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        animate={
          currentTab !== "search"
            ? { backgroundColor: "var(--color-accent)", width: "60px", borderRadius: "50%", x: 0 }
            : { backgroundColor: "var(--color-surface)", width: "160px", borderRadius: "8px", x: -5 }
        }
        onClick={onClick}
        className={`cursor-pointer flex justify-center items-center h-15 will-change-transform`}>
        <div className="relative w-full">
          <AnimatePresence>
            {currentTab !== "search" ? (
              <motion.p
                className="absolute top-1/2 left-1/2 -translate-1/2 w-full flex justify-center items-center"
                key={"search-mode"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                exit={{ opacity: 0 }}>
                <UserPlusIcon className="text-text-inverted w-8 h-8" />{" "}
              </motion.p>
            ) : (
              <motion.p
                className="text-text-primary absolute top-1/2 left-1/2 -translate-1/2 w-40 flex justify-center items-center"
                key={"exit-mode"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                Выйти из поиска
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </>
  );
}

export function ToggleButtonSkeleton() {
  return (
    <>
      <button className={`shimmer pointer-events-none flex justify-center items-center w-15 h-15 rounded-full`}></button>
    </>
  );
}
