"use client";

import React from "react";

export default function SubmitButton({ disabled, className, children }: { disabled?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <button disabled={disabled} type="submit" className={`px-1.5 py-0.5 rounded-md ${className} ${disabled ? "opacity-20 pointer-events-none" : ""} transition-all duration-200`}>
      {children}
    </button>
  );
}
