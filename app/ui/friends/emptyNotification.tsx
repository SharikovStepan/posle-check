import React from "react";

export default function EmptyNotification({ children }: { children: React.ReactNode }) {
  return <div className="text-3xl w-full text-center bg-grey-olive-400 rounded-xl py-2	">{children}</div>;
}
