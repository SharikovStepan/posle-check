"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

export default function SearchUI({ searchText, placeholder, onSearchChange }: { searchText: string; placeholder: string; onSearchChange: (query: string) => void }) {
  const [currentText, setCurrentText] = useState(searchText);

  const debounceTmr = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTmr.current) {
      clearTimeout(debounceTmr.current);
    }

    debounceTmr.current = setTimeout(() => {
      onSearchChange(currentText);
    }, 333);

    return () => {
      if (debounceTmr.current) {
        clearTimeout(debounceTmr.current);
      }
    };
  }, [currentText]);

  return (
    <div className="relative flex border-2 border-border bg-surface rounded-md h-full w-full shadow-sm">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        name="search"
        className="peer border-0 focus:border-0 focus block w-full rounded-md pl-10 text-sm text-foreground placeholder:text-muted-foreground bg-transparent"
        placeholder={placeholder}
        onChange={(e) => setCurrentText(e.target.value)}
        value={currentText}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-full w-4.5 -translate-y-1/2 text-muted-foreground peer-focus:text-foreground" />
    </div>
  );
}
