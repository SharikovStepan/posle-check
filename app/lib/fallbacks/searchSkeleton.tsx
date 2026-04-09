import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchSkeleton() {
  return (
    <div className="relative flex border-2 border-border bg-surface rounded-md h-full w-full shadow-sm">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="shimmer peer border-0 focus:border-0 focus block w-full rounded-md pl-10 text-sm text-foreground placeholder:text-muted-foreground bg-transparent"></div>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-full w-4.5 -translate-y-1/2 text-muted-foreground peer-focus:text-foreground" />
    </div>
  );
}
