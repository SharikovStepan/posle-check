"use client";

import { useEffect, useState } from "react";
import { TabButtons } from "../lib/types/types.filters";
import { motion } from "motion/react";

export default function TabButtonsUI<T extends string>({ tabs, currentTab, onTabChange }: { tabs: TabButtons<T>[]; currentTab: T; onTabChange: (targetTab: T) => void }) {
  const [optimisticTab, setOptimisticTab] = useState<T | null>(null);

  const displayTab = optimisticTab ?? currentTab;

  useEffect(() => {
    setOptimisticTab(null);
  }, [currentTab]);

  const tabsKey = tabs.map((tab) => tab.tabType).join("");
  return (
    <>
      {tabs.map((tab) => {
        const isActive = displayTab === tab.tabType;
        return (
          <motion.button
            animate={{ backgroundColor: "var(--color-bg-tertiary-off)", transition: { duration: 0.5 } }}
            whileHover={{ backgroundColor: "var(--color-bg-tertiary)", transition: { duration: 0.2 } }}
            whileTap={{ backgroundColor: "var(--color-bg-tertiary)", transition: { duration: 0.15 } }}
            key={tab.tabType}
            disabled={isActive}
            onClick={() => {
              setOptimisticTab(tab.tabType);
              onTabChange(tab.tabType);
            }}
            className={`${isActive ? "pointer-events-none" : ""} relative cursor-pointer w-full h-full rounded-lg focus z-10`}>
            <motion.div
              animate={isActive ? { color: "var(--color-text-inverted)", transition: !optimisticTab ? { duration: 0 } : { duration: 0.3 } } : { color: "var(--color-text-primary)" }}
              className="will-change-auto flex items-center justify-center gap-1 z-40">
              {tab.icon && <div className="w-fit flex justify-center items-center z-40" dangerouslySetInnerHTML={{ __html: tab.icon }} />}

              <p className=" md:block text-xs md:text-md z-40">{tab.text}</p>
            </motion.div>
            {isActive && (
              <motion.div
                layoutId={`tab-button-bg-${tabsKey}`}
                id={`tab-button-bg-${tabsKey}`}
                className="will-change-transform bg-accent rounded-lg pointer-events-none z-0 absolute top-0 left-0 w-full h-full"></motion.div>
            )}
          </motion.button>
        );
      })}
    </>
  );
}
