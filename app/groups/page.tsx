import Link from "next/link";
import PageHeader from "../ui/pageHeader";

export default function Page() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Группы"} />
        <div className="rounded-md h-full p-3 bg-grey-olive-300">Группы</div>
		  <Link href={'/groups/create-group'} className="w-15 h-15 rounded-full bg-accent" />
      </div>
    </>
  );
}
