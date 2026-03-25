import React from "react";

export default function EmptyNotification({ children }: { children: React.ReactNode }) {
  return <div className="text-xl w-full text-center ">{children}</div>;
}
