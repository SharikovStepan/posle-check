"use client";
import { Dispatch, SetStateAction, useState } from "react";

export default function ToggleButton({
  toggleState,
  toggleChange,
  inputName,
  labelText,
}: {
  toggleState: boolean;
  toggleChange: Dispatch<SetStateAction<boolean>>;
  inputName: string;
  labelText: string;
}) {
  const handleOnChange = () => {
    toggleChange((prev) => !prev);
  };

  return (
    <>
      <label className="inline-flex w-full items-center justify-between gap-2">
        <span className="select-none text-lg font-medium text-text-primary">{labelText}</span>

        <input name={inputName} type="checkbox" checked={toggleState} onChange={handleOnChange} className="sr-only peer" />
        <div className="cursor-pointer relative w-16 h-8 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-(--ring) rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-border after:content-[''] after:absolute after:top-0 after:border-border after:border-2 after:bg-text-primary after:rounded-full after:h-8 after:w-8 after:transition-all transition-all peer-checked:bg-accent/70"></div>
      </label>
    </>
  );
}
