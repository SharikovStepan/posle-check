"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function SingleSearchParamButton({ filterType, filterValue, className, children }: { children: React.ReactNode; filterType: string; filterValue: string; className?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set(filterType, filterValue);
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <button
        disabled={searchParams.get(filterType) === filterValue}
        onClick={handleClick}
        className={`${
          searchParams.get(filterType) === filterValue ? "bg-accent text-text-primary pointer-events-none shadow-sm" : "bg-surface text-text-secondary hover:bg-surface-hover hover:shadow-sm"
        }  transition-all duration-200 ${className}`}>
        {children}
      </button>
    </>
  );
}
