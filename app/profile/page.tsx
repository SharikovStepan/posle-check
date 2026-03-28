import PageHeader from "../ui/pageHeader";
import ThemeToggle from "../ui/themeToggle";

export default function Page() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Профиль"} />
        <div className="rounded-md h-full p-3 bg-grey-olive-300">Профиль</div>
		  <ThemeToggle />
      </div>
    </>
  );
}
