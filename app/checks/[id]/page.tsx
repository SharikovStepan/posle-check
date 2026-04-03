import PageHeader from "@/app/ui/pageHeader";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Чек"} />
        <div className="rounded-md h-full p-3 bg-grey-olive-300">{id}</div>
      </div>
    </>
  );
}
