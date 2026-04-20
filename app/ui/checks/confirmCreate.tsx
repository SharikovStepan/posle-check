import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Spinner from "../spinner";

export default function ConfirmCreate({
  totalAmount,
  tipsAmount,
  title,
  creator,
  members,
  remindAmount,
  isPending,
  onCancel,
  onConfirm,
}: {
  totalAmount: number;
  tipsAmount: number;
  title: string;
  creator: CreateCheckParticipantsCardsType;
  members: CreateCheckParticipantsCardsType[];
  remindAmount: number;
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  const memberTips = tipsAmount > 0 ? tipsAmount / (members.filter((m) => m.participating).length + (creator.participating ? 1 : 0)) : 0;

  const creatorAmountText: string = memberTips == 0 ? `${creator.amount} ₽` : `${creator.amount} + ${parseFloat(memberTips.toFixed(0))} ₽`;

  return (
    <>
      <dialog className="flex flex-col gap-4 rounded-lg p-4 bg-bg-secondary border-2 border-accent w-full text-text-primary">
        <div className="space-y-2">
          <div className="flex gap-2">
            <p className="font-medium">Название:</p>
            <h4>{title}</h4>
          </div>
          <div className="flex gap-2">
            <p className="font-medium">Сумма чека:</p>
            <p>{totalAmount} ₽</p>
          </div>
          <div className="flex gap-2">
            <p className="font-medium">Моя часть:</p>
            <p>{creator.participating ? `${creatorAmountText}` : "Не участвую"}</p>
          </div>
        </div>

        {members.some((m) => m.participating && m.amount > 0) && (
          <>
            {/* <span className="block w-full bg-surface-hover mb-2 h-0.5 "></span> */}

            <div className="shadow-xl flex flex-col justify-center mb-2 bg-bg-tertiary rounded-lg p-2">
              <h3 className="font-semibold mb-2 text-center">Установленные суммы</h3>
              <table className="w-full border-collapse">
                {/* <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3">Пользователь</th>
                  <th className="text-right py-2 px-3">Сумма</th>
                </tr>
              </thead> */}
                <tbody>
                  {members.map((member) => {
                    if (member.participating && member.amount > 0) {
                      const amountText: string = memberTips == 0 ? `${member.amount} ₽` : `${member.amount} + ${parseFloat(memberTips.toFixed(0))} ₽`;
                      return (
                        <tr key={member.id} className="last:border-0 border-b border-text-tertiary/20">
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-3">
                              {member.avatar_url ? (
                                <img src={member.avatar_url} alt={member.username} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <UserCircleIcon className="w-8 h-8 text-accent/80" />
                              )}
                              <span>{member.full_name || member.username}</span>
                            </div>
                          </td>
                          <td className="text-right py-2 px-3 font-medium">{amountText}</td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {members.some((m) => m.participating && (!m.amount || m.amount === 0)) && (
          <>
            <div className="flex flex-col justify-center gap-2 bg-bg-tertiary rounded-lg p-2 shadow">
              <h3 className="font-semibold mb-2 text-center">Сумма на усмотрение участника</h3>
              {memberTips > 0 && <p className="text-center text-text-tertiary/80">{`+ ${parseFloat(memberTips.toFixed(0))} ₽`}</p>}
              <ul className="flex flex-wrap gap-2">
                {members.map((member) => {
                  if (member.participating && (!member.amount || member.amount === 0)) {
                    return (
                      <li
                        key={member.id}
                        className="last:border-0 last:md:border-b border-b border-text-tertiary/20 w-full md:w-auto md:min-w-[calc(50%-5px)] lg:min-w-[calc(33%-5px)] h-fit py-2 px-3">
                        <div className="flex items-center gap-3">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt={member.username} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <UserCircleIcon className="w-8 h-8 text-accent/80" />
                          )}
                          <p>{member.full_name || member.username}</p>
                        </div>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>

            {/* <span className="block w-full bg-surface-hover mb-0 h-0.5"></span> */}
          </>
        )}

        {remindAmount !== 0 && (
          <div className="flex gap-2 bg-bg-tertiary rounded-lg p-2">
            <p className="font-medium text-text-secondary">Нераспределенная сумма:</p>
            <h4>{remindAmount}</h4>
          </div>
        )}

        <div className="dialog-buttons flex w-full justify-center gap-5 mt-4">
          <button onClick={onCancel} type="button" className={`${isPending ? "opacity-50" : ""} btn-cancel button bg-error w-27`}>
            Отклонить
          </button>
          <button disabled={isPending} onClick={onConfirm} type="button" className="btn-confirm button bg-accent w-30 text-text-inverted text-nowrap">
            <p className={`${isPending ? "hidden" : ""}`}>Создать Чек</p>
            <Spinner className={`${isPending ? "block" : "hidden!"}`} />
          </button>
        </div>
      </dialog>
    </>
  );
}
