"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function SingleSearchParamButton({ filterType, filterValue, icon, text }: { filterType: string; icon: string; text: string; filterValue: string }) {
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
    searchParams.get(filterType) === filterValue
      ? "bg-primary text-primary-foreground pointer-events-none shadow-sm"
      : "bg-surface text-foreground hover:bg-surface-strong hover:shadow-sm"
  } button button-filter transition-all duration-200`}>
  <div>
    {icon}
    <p>{text}</p>
  </div>
</button>  </>
  );
}
