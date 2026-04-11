"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export default function TimeoutBackButton() {
  const router = useRouter();

  const [showButton, setShowButton] = useState(false);
  const tmr = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (tmr.current) {
      clearTimeout(tmr.current);
    }

    tmr.current = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    return () => {
      if (tmr.current) {
        clearTimeout(tmr.current);
      }
    };
  }, []);

  if (showButton) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <button className="cursor-pointer w-15 h-15 rounded-full bg-surface flex justify-center items-center" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </button>
      </motion.div>
    );
  } else {
    return null;
  }
}
