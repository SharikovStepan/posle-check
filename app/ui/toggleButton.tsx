"use client";
import { Dispatch, SetStateAction, useState } from "react";

export default function ToggleButton({
  error,
  toggleState,
  toggleChange,
  inputName,
  labelText,
}: {
  error: string | null;
  toggleState: boolean;
  toggleChange: () => void;
  inputName: string;
  labelText: string;
}) {
  return (
    <>
      <label className="inline-flex w-full items-center justify-between gap-2">
        <span className="select-none text-lg font-medium text-text-primary">{labelText}</span>

        <input aria-describedby={error ? `${inputName}-error` : undefined} name={inputName} type="checkbox" checked={toggleState} onChange={toggleChange} className="sr-only peer" />
        <div className="cursor-pointer relative w-16 h-8 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-(--ring) rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-border after:content-[''] after:absolute after:top-0 after:border-border after:border-2 after:bg-text-primary after:rounded-full after:h-8 after:w-8 after:transition-all transition-all peer-checked:bg-accent/70">
          {error && (
            <div
              id={`${inputName}-error`}
              role="alert"
              className="absolute z-50 flex justify-center w-65 items-center text-center top-0 right-0 -translate-y-[calc(100%+6px)] bg-error text-text-primary px-3 py-2 rounded-lg shadow-lg transition-all">
              {error}
            </div>
          )}
        </div>
      </label>
    </>
  );
}
