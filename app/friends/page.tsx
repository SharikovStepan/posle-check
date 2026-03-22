import PageHeader from "../ui/pageHeader";

export default function Page() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Друзья"} />
        <div className="rounded-md h-full p-3 bg-grey-olive-300">Друзья</div>
      </div>
    </>
  );
}
