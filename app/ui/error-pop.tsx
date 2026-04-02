export default function ErrorPop({ position, inputName, errorText }: { position: "left" | "right" | "center"; inputName: string; errorText: string }) {
  return (
    <>
      <div
        id={`${inputName}-error`}
        role="alert"
        className={`
			${position == "center" && "top-0 left-1/2 -translate-y-full -translate-x-1/2"}
			${position == "left" && "bottom-0 left-0 translate-y-[calc(100%+6px)]"}
			${position == "right" && "top-0 right-0 -translate-y-[calc(100%+6px)]"} 
			absolute z-50 flex justify-center w-65 items-center text-center bg-error text-text-primary px-3 py-2 rounded-lg shadow-lg transition-all`}>
        {errorText}
      </div>
    </>
  );
}
