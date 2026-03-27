"use client";

import { useState, useEffect } from "react";

export function useIsDesktop(widthBreakpoint: number) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= widthBreakpoint);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [widthBreakpoint]);

  return isDesktop;
}
