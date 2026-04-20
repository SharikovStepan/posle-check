import BackButton from "@/app/ui/backButton";
import PageHeader from "@/app/ui/pageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CreateCheckPageSkeleton() {
  return (
    <>
      <main className="flex flex-col gap-3">
        <div className="header-div h-full md:shrink-0 md:h-(--header-height) flex justify-between items-center mb-2">
          <BackButton className="cursor-pointer w-15 h-15 rounded-full bg-surface flex justify-center items-center">
            <ArrowLeftIcon className="w-1/2 h-1/2" />
          </BackButton>
          <PageHeader title={"Новый чек"} />
        </div>

        <div className="h-full">
          <CreateCheckFormSkeleton />
        </div>
      </main>
    </>
  );
}

export function CreateCheckFormSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3 items-center lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12">
        <div className="inputs-div w-full lg:row-[1/2] lg:col-[1/2] flex flex-col gap-6">
          <div className="relative h-full flex flex-col gap-1">
            <label htmlFor="title" className="block text-lg text-text-primary">
              Название
            </label>
            <div className={`shimmer-dark mt-1 block w-full h-8 bg-bg-secondary rounded-lg shadow-sm sm:text-sm px-3`} />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg text-text-secondary">
              Описание <span className="text-bg-tertiary">(необязательно)</span>
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="shimmer-dark pointer-events-none mt-1 resize-none block w-full bg-bg-secondary rounded-lg border-border shadow-sm sm:text-sm px-3 py-2 focus"
            />
          </div>

          <div className="relative h-full flex justify-between items-center gap-1">
            <label htmlFor="title" className="block text-lg text-text-primary">
              Сумма
            </label>

            <div className="flex justify-center items-center gap-2">
              <p>₽</p>

              <div className={`shimmer block w-30 h-8 bg-bg-secondary rounded-lg justify-self-end shadow-sm sm:text-sm px-3 text-end`} />
            </div>
          </div>

          <div className={`relative h-full flex justify-between items-center gap-1`}>
            <label htmlFor="title" className="block text-lg text-text-primary">
              Моя часть
            </label>

            <div className="flex justify-center items-center gap-2">
              <p>₽</p>

              <div className={`shimmer block w-30 h-8 bg-bg-secondary rounded-lg justify-self-end shadow-sm sm:text-sm px-3 text-end`} />
            </div>
          </div>

          <label className="inline-flex w-full items-center justify-between gap-2">
            <span className="select-none text-lg font-medium text-text-primary">{"Добавить всех"}</span>
            <div className="shimmer pointer-events-none relative w-16 h-8 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-(--ring) rounded-full"></div>
          </label>

          <span className="block w-full bg-surface mt-0 h-0.5 "></span>

          <div className="flex flex-col gap-4">
            <label className="inline-flex w-full items-center justify-between gap-2">
              <span className="select-none text-lg font-medium text-text-primary">{"Поделить всю сумму"}</span>

              <div className="shimmer pointer-events-none relative w-16 h-8 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-(--ring) rounded-full"></div>
            </label>

            <label className="inline-flex w-full items-center justify-between gap-2">
              <span className="select-none text-lg font-medium text-text-primary">{"Включить меня"}</span>

              <div className="shimmer pointer-events-none relative w-16 h-8 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-(--ring) rounded-full"></div>
            </label>
          </div>

          <span className="block w-full bg-surface mt-0 h-0.5"></span>

          <div className={`flex flex-col gap-3`}>
            <label className="inline-flex w-full items-center justify-between gap-2">
              <span className="select-none text-lg font-medium text-text-primary">{"Поделить доставку/чаевые"}</span>

              <div className="shimmer pointer-events-none relative w-16 h-8 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-(--ring) rounded-full"></div>
            </label>

            <div className="relative h-full flex justify-between items-center gap-1">
              <label htmlFor="title" className="block text-lg text-text-primary opacity-40">
                Сумма
              </label>

              <div className="flex justify-center items-center gap-2">
                <p className="opacity-40">₽</p>

                <div className={`shimmer block w-30 h-8 bg-bg-secondary rounded-lg justify-self-end shadow-sm sm:text-sm px-3 text-end`} />
              </div>
            </div>
          </div>
          <span className="block w-full bg-surface mb-3 h-0.5 "></span>

          <div className={`shimmer-dark flex w-full h-8 bg-bg-secondary rounded-lg lg:hidden mb-2`}></div>

          {/* <span className="block w-full bg-surface mt-6 h-0.5 "></span> */}
        </div>
        <div className="lg:col-[2/3] row-[1/3]"></div>
        {/* <div ref={membersListhRef} className={`${tabType == "members" ? "flex" : "hidden"} relative lg:flex flex-col lg:col-[1/2] row-[2/3] gap-2 w-full min-h-100 mb-14`}>
      {localErrors.participants && <ErrorPop position="center" inputName={"participants"} errorText={localErrors.participants} />}

      <p className="text-xl">Участники</p>
      <div className="h-10">
        <SearchUI onSearchChange={onSearchChange} placeholder="Поиск.. " searchText={searchQuery} />
      </div>
      <MembersList searchQuery={searchQuery} />
    </div>

    <div className={`${tabType == "amounts" ? "flex" : "hidden"} relative lg:h-full lg:flex flex-col lg:col-[2/3] row-[1/3] justify-self-start self-start w-full gap-2 min-h-100 mb-14`}>
      <span className="absolute top-0 -left-6 block w-0.5 h-full bg-surface "></span>

      <div className="flex justify-between items-center">
        <p className="text-xl">Суммы</p>
        <p className={`text-md ${remindAmount < 0 ? "text-error" : remindAmount == 0 ? "text-success" : "text-warning"}`}>Не распределено: {remindAmount} ₽</p>
      </div>
      <ParticipantsList />
    </div> */}
      </div>
    </>
  );
}
