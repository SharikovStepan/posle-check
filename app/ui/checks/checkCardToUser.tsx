import { DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";
import PaidCounter from "./paidCounter";
import ProgressBar from "./progressBar";
import { CheckToUserCardType } from "@/app/lib/types/types.checks";

export default function CheckToUserCard({ checkData }: { checkData: CheckToUserCardType }) {
  const date = new Date(checkData.created_at);

  const formattedDate = date
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(" г.", "");

  const formatAmount = checkData.share_amount != null ? parseFloat(checkData.share_amount).toString() : null;

  return (
    <>
      <div className="w-full bg-surface p-4 rounded-xl grid grid-cols-[auto_2fr_1fr] gap-x-3 gap-y-4 ">
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

        <div className="grid grid-rows-[1fr_auto] justify-items-end items-center">
          {formatAmount && !checkData.is_paid ? (
            <div className="flex gap-1 justify-center items-center text-xl font-bold tracking-wide">
              <p className="text-text-primary self-end justify-self-end">{formatAmount}</p>
              <p className="text-text-primary">₽</p>
            </div>
          ) : (
            ""
          )}

          <div className={`text-xs text-nowrap ${formatAmount ? "row-[2/3]" : "row-[1/3]"}`}>
            {!checkData.participated ? <p className="text-text-tertiary">Не участвовал</p> : !checkData.is_paid ? <p className="text-warning">Не оплачен</p> : <p className="text-success">Оплачен</p>}
          </div>
        </div>

        {/* <ProgressBar current={checkData.paid_participants_count} total={checkData.participants_count} /> */}
      </div>
    </>
  );
}
