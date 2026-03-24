"use client";

import React from "react";

export default function SubmitButton({ disabled, className, children }: { disabled?: boolean; className?: string; children: React.ReactNode }) {
  return (
<button disabled={disabled} type="submit" className={`button ${className} ${disabled ? "opacity-20 pointer-events-none" : ""} transition-all duration-200`}>
  {children}
</button>
  );
}
