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
          searchParams.get(filterType) === filterValue ? "bg-indigo-velvet-500 text-grey-olive-100 pointer-events-none" : "text-indigo-velvet-600 hover:bg-indigo-velvet-300"
        } button button-filter`}>
        <div>
          {icon}
          <p>{text}</p>
        </div>
      </button>
    </>
  );
}
