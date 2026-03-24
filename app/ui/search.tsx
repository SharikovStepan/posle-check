"use client";

import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("query")?.toString() || "");
  const { replace } = useRouter();
  const pathname = usePathname();

  const debounceTmr = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTmr.current) {
      clearTimeout(debounceTmr.current);
    }

    debounceTmr.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value !== "") {
        params.set("query", value);
        replace(`${pathname}?${params.toString()}`);
      } else {
        params.delete("query");
        replace(`${pathname}?${params.toString()}`);
      }
    }, 333);

    return () => {
      if (debounceTmr.current) {
        clearTimeout(debounceTmr.current);
      }
    };
  }, [value]);

  return (
    <div className="relative flex border-2 border-indigo-velvet-500 rounded-md h-full w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer border-0 focus:border-0 outline-0 outline-indigo-velvet-600 focus:outline-2 block w-full rounded-md pl-10 text-sm text-indigo-velvet-700 placeholder:text-indigo-velvet-500"
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-full w-4.5 -translate-y-1/2 text-indigo-velvet-600 peer-focus:text-indigo-velvet-800" />
    </div>
  );
}
