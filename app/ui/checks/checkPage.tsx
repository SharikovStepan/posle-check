import CheckDetailsByUser from "./checkDetailsByUser";
import PageHeader from "../pageHeader";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getCheckDetails } from "@/app/lib/data/data.checks";
import CheckDetailsToUser from "./checkDetailsToUser";
import BackButton from "../backButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CheckPage({ pageParams }: { pageParams: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await pageParams;
  const checkId = params.id;

  const checkDetails = await getCheckDetails(checkId, session.user.id);

  const date = new Date(checkDetails.created_at);

  const formattedDate = date
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(" г.", "");

  const formattedTime = date.toLocaleTimeString("ru-RU", {
    hour: "numeric",
    minute: "numeric",
  });

  const isCreator = checkDetails.creator.id == session.user.id;
  return (
    <>
      <div className="header-div h-21 flex justify-between gap-4 items-center mb-2">
        <BackButton className="cursor-pointer w-15 h-15 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </BackButton>

        <div className="flex flex-col gap-2 w-fit items-center self-start">
          <PageHeader title={checkDetails.title} />
          <div className="flex gap-2 text-xs text-text-tertiary items-center">
            <p className="">{formattedDate}</p>
            <span className="inline-block bg-text-tertiary h-1 w-1 rounded-full"></span>
            <p>{formattedTime}</p>
          </div>
        </div>
      </div>

      {isCreator ? <CheckDetailsByUser checkData={checkDetails} /> : <CheckDetailsToUser checkData={checkDetails} />}
    </>
  );
}
