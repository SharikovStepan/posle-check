import Image from "next/image";
import ButtonToCreate from "./ui/buttonToCreate";
import PageHeader from "./ui/pageHeader";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Home Page"} />
        <div className="rounded-md h-full p-3 bg-grey-olive-300">
          {/* <ButtonToCreate /> */}
        </div>
      </div>
    </>
  );
}
