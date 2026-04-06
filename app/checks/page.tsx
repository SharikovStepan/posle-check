import PageHeader from "../ui/pageHeader";
import { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'Чеки',
 };


export default function Page() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Чеки"} />
        <div className="rounded-md h-full p-3 bg-bg-secondary flex flex-col justify-center items-center gap-2">
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="text-text-primary text-lg">Позже здесь будет список чеков</p>
            <p className="text-text-tertiary/80 text-sm">А пока их можно найти в группах</p>
          </div>
        </div>
      </div>
    </>
  );
}
