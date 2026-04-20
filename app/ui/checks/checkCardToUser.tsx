import { DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";
import PaidCounter from "./paidCounter";
import ProgressBar from "./progressBar";
import { CheckToUserCardType } from "@/app/lib/types/types.checks";
import Link from "next/link";

export default function CheckToUserCard({ checkData }: { checkData: CheckToUserCardType }) {
  const date = new Date(checkData.created_at);

  const formattedDate = date
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(" г.", "");

  //   const formatAmount = checkData.share_amount != null ? parseFloat(checkData.share_amount).toString() : null;

  return (
    <>
      <Link
        href={`/checks/${checkData.id}`}
        className={`${
          !checkData.participated ? "pointer-events-none cursor-default opacity-55" : ""
        } block hover:border-border-focus border border-transparent cursor-pointer transition-all duration-200 focus rounded-2xl`}>
        <div className="w-full bg-surface px-2 py-3 md:px-3 rounded-2xl grid grid-cols-[auto_2fr_1fr] gap-x-3 gap-y-4 ">
          <div className="flex justify-center items-center w-full h-full bg-bg-tertiary rounded-lg">
            {checkData.icon_url ? (
              <div className={`h-12 rounded-full overflow-hidden`}>
                <img src={checkData.icon_url} alt="group icon" className="w-full h-full object-cover" />
              </div>
            ) : (
              <DocumentCurrencyDollarIcon className={`h-12 w-full text-accent/80 overflow-hidden`} />
            )}
          </div>

          <div className="flex flex-col justify-between items-start">
            <h3 className="text-text-primary text-md md:text-xl font-medium max-h-14 overflow-hidden text-ellipsis">{checkData.title}</h3>
            <p className="text-text-tertiary text-xs md:text-sm">{formattedDate}</p>
          </div>

          <div className="grid grid-rows-[1fr_auto] justify-items-end items-center gap-y-1">
            {checkData.payment_status != "confirmed" && (checkData.share_amount || checkData.payment_amount) ? (
              <div className="flex gap-1 justify-center items-center text-xl font-bold tracking-wide">
                <p className="text-text-primary self-end justify-self-end">{(checkData.share_amount || 0) + (checkData.tips_amount || 0) || checkData.payment_amount}</p>
                <p className="text-text-primary">₽</p>
              </div>
            ) : (
              ""
            )}

            <div className={`${checkData.payment_status == "confirmed" || !checkData.participated || !checkData.share_amount ? "row-[1/3]" : "row-[2/3]"}`}>
              <PayStatusView status={checkData.payment_status} participated={checkData.participated} />
            </div>
          </div>

          {/* <ProgressBar current={checkData.paid_participants_count} total={checkData.participants_count} /> */}
        </div>
      </Link>
    </>
  );
}

export function PayStatusView({ status, participated }: { status: "confirmed" | "pending" | "declined" | "unpaid"; participated: boolean }) {
  let text: string = "не участвовал";
  let color: string = "var(--color-bg-tetriary)";

  if (participated) {
    switch (status) {
      case "confirmed":
        color = "var(--color-success)";
        text = "Оплачен";
        break;
      case "declined":
        color = "var(--color-error)";
        text = "Платёж отклонен";
        break;
      case "pending":
        color = "var(--color-warning)";
        text = "Подтверждается";
        break;
      case "unpaid":
        color = "var(--color-error)";
        text = "Не оплачен";
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className="px-2 py-0.5 w-fit relative flex justify-center items-center">
        <span style={{ backgroundColor: color }} className="z-0 opacity-10 absolute top-1/2 left-1/2 -translate-1/2 w-full h-full rounded-2xl bg-bg-tertiary"></span>
        <p style={{ color: color }} className="z-0 text-success text-xs md:text-sm text-nowrap">
          {text}
        </p>
      </div>
    </>
  );
}
