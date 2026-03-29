import { CheckCardType } from "@/app/lib/types/types.checks";
import { DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";
import PaidCounter from "./paidCounter";
import ProgressBar from "./progressBar";

const RubleIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Currency-Ruble--Streamline-Sharp-Material" height="24" width="24">
    <path
      fill="#000000"
      d="M7.25 21v-3.25H5v-1.5h2.25V13.5H5v-1.5h2.25V3h6.5c1.46365 0 2.7046 0.509415 3.72275 1.52825C18.4909 5.5471 19 6.78875 19 8.25325c0 1.4645 -0.5091 2.7051 -1.52725 3.72175C16.4546 12.99165 15.21365 13.5 13.75 13.5h-5v2.75H13v1.5h-4.25V21h-1.5Zm1.5 -9h5c1.05 0 1.9375 -0.3625 2.6625 -1.0875C17.1375 10.1875 17.5 9.3 17.5 8.25s-0.3625 -1.9375 -1.0875 -2.6625C15.6875 4.8625 14.8 4.5 13.75 4.5h-5v7.5Z"
      stroke-width="0.5"></path>
  </svg>
);

export default function CheckCard({ checkData }: { checkData: CheckCardType }) {
  console.log("created_at", checkData.created_at);

  const date = new Date(checkData.created_at);

  const formattedDate = date
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(" г.", "");

  const formatAmount = parseFloat(checkData.total_amount).toString();

  return (
    <>
      <div className="w-full bg-surface p-4 rounded-xl grid grid-cols-[auto_2fr_1fr] gap-x-3 gap-y-4 grid-rows-[1fr_auto]">
        <div className="flex justify-center items-center w-full h-full bg-bg-tertiary rounded-lg">
          {checkData.icon_url ? (
            <div className={`h-12 rounded-full overflow-hidden`}>
              <img src={checkData.icon_url} alt="group icon" className="w-full h-full object-cover" />
            </div>
          ) : (
            <DocumentCurrencyDollarIcon className={`h-12 w-full text-accent/80 overflow-hidden`} />
          )}
        </div>

        <div className="flex flex-col justify-center items-start">
          <h3 className="text-text-primary text-xl font-medium">{checkData.title}</h3>
          <p className="text-text-tertiary text-sm">{formattedDate}</p>
        </div>

        <div className="flex flex-col justify-center items-end">
          <div className="flex gap-2 justify-center items-center text-xl font-bold tracking-wide">
            <p className="text-text-primary self-end justify-self-end">{formatAmount}</p>
            <p className="text-text-primary">₽</p>
          </div>
          <PaidCounter paid={checkData.paid_participants_count} total={checkData.participants_count} />
        </div>

        <ProgressBar current={checkData.paid_participants_count} total={checkData.participants_count} />
      </div>
    </>
  );
}
