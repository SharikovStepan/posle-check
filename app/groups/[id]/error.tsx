"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong With Group page</h2>

      <Link href={"/groups"} className="mt-4 rounded-md bg-accent px-4 py-2 text-sm text-text-inverted transition-colors hover:bg-accent-hover">
        К списку групп
      </Link>
      {/* <button
        className="mt-4 rounded-md bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }>
        Try again
      </button> */}
    </main>
  );
}
