"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function ToggleFilterButton({
  filterType,
  filterValue1,
  filterValue2,
  classNames1,
  classNames2,
  classNamesCommon,
  children,
}: {
  filterType: string;
  filterValue1: string;
  filterValue2: string;
  classNames1: string;
  classNames2: string;
  classNamesCommon?:string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);

    const currentParam = params.get(filterType);
    if (currentParam == filterValue1) {
      params.set(filterType, filterValue2);
    } else {
      params.set(filterType, filterValue1);
    }

    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <button onClick={handleClick} className={`${searchParams.get(filterType) === filterValue1 ? classNames1 : classNames2} ${classNamesCommon}`}>
        <div>{children}</div>
      </button>
    </>
  );
}
