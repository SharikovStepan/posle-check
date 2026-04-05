// components/BackButton.jsx (Client Component)
"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ children, className }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();

  return (
    <button className={className} onClick={() => router.back()}>
      {children}
    </button>
  );
}
