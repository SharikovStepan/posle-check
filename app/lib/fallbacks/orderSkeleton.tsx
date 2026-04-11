export default function OrderSettingsSkeleton() {
  return (
    <div className="flex gap-2 h-10 w-full">
      <div className="relative w-full">
        <div
          className="shimmer-dark h-full w-full
        px-2
        flex justify-start items-center
        appearance-none
        bg-surface
        border border-border
        rounded-md
        pointer-events-none
        font-medium
        text-text-primary
        hover:bg-surface-hover
        focus
        shadow-sm"></div>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-0.5 text-muted-foreground">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <button
        type="button"
        className="
		  w-10
		  shimmer-dark
      bg-surface
      text-foreground
      border border-border
      rounded-md
      hover:bg-surface-hover
		focus
      font-medium
      flex
      items-center
      gap-1
      h-full
      pointer-events-none
      shadow-sm
      transition-all duration-200
    ">
        <div className="w-8 h-2/3 text-muted-foreground"></div>
      </button>
    </div>
  );
}
