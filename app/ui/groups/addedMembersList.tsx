"use client";

import { User } from "@/app/lib/types/types.user";
import EditMemberCard from "./editMemberCard";
import { motion, AnimatePresence } from "motion/react";

export default function AddedMembersList({ usersData }: { usersData: User[] }) {
  return (
    <>
      <div className="flex flex-col gap-3 w-full lg:h-full relative mb-20">
        <span className="absolute top-0 -left-6 block w-0.5 h-full bg-surface"> </span>
        <h3 className="text-lg hidden lg:block lg:mb-2 text-start">Добавленные друзья</h3>
        <AnimatePresence mode="sync">
          {usersData.length > 0
            ? usersData.map((user) => {
                return (
                  <motion.div
                    className="will-change-transform"
                    layout
                    key={`${user.id}-in-choosedList`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    //   transition={{ duration: 0.5, layout: { duration: 0.2 } }}
                  >
                    <EditMemberCard choosedList={true} key={user.id} userData={user} />
                  </motion.div>
                );
              })
            : ""}
        </AnimatePresence>
      </div>
    </>
  );
}
